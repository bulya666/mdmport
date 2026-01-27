const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const mysqldump = require('mysqldump');
require('dotenv').config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mdmport_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
  charset: 'utf8mb4'
};

const DB_NAME = DB_CONFIG.database;
const SQL_FILE = path.join(__dirname, '../../mdmport_db.sql');

const pool = mysql.createPool(DB_CONFIG);

async function createConnectionWithRetry(options = {}, maxRetries = 10, baseDelay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await mysql.createConnection(options);
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 100;
        console.warn(`MySQL connection failed (attempt ${attempt}/${maxRetries}). Retrying in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Failed to connect after ${maxRetries} attempts: ${lastError.message}`);
}

async function ensureDatabaseExists() {
  const connection = await createConnectionWithRetry({
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password
  });

  try {
    await connection.query(`
      CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_bin
    `);
    console.log(`Database '${DB_NAME}' ensured to exist.`);
  } finally {
    await connection.end();
  }
}

async function isDatabaseEmpty() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT COUNT(*) as tableCount
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
    `);
    return rows[0].tableCount === 0;
  } finally {
    connection.release();
  }
}

async function executeSqlFile(filePath, connection) {
  const sqlContent = await fs.readFile(filePath, 'utf8');

  const statements = [];
  let currentStatement = '';
  let inQuote = false;
  let quoteChar = '';
  let inBlockComment = false;
  let inLineComment = false;

  for (let i = 0; i < sqlContent.length; i++) {
    const char = sqlContent[i];
    const nextChar = sqlContent[i + 1] || '';

    if (!inQuote && !inBlockComment && char === '/' && nextChar === '*') {
      inBlockComment = true;
      i++;
      continue;
    }

    if (inBlockComment && char === '*' && nextChar === '/') {
      inBlockComment = false;
      i++;
      continue;
    }

    if (!inQuote && !inBlockComment && char === '-' && nextChar === '-') {
      inLineComment = true;
      continue;
    }

    if (inLineComment && char === '\n') {
      inLineComment = false;
    }

    if (inBlockComment || inLineComment) {
      continue;
    }

    if (!inBlockComment && !inLineComment && (char === "'" || char === '"' || char === '`')) {
      if (!inQuote) {
        inQuote = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        if (sqlContent[i - 1] !== '\\') {
          inQuote = false;
        }
      }
    }

    if (!inQuote && char === ';') {
      const trimmed = currentStatement.trim();
      if (trimmed) {
        statements.push(trimmed);
      }
      currentStatement = '';
    } else {
      currentStatement += char;
    }
  }

  for (const statement of statements) {
    if (statement.trim()) {
      await connection.query(statement);
    }
  }
}

async function loadSqlOnStart() {
  try {
    await ensureDatabaseExists();

    const isEmpty = await isDatabaseEmpty();
    if (!isEmpty) {
      console.log('Database already contains data, skipping SQL import.');
      return;
    }

    try {
      await fs.access(SQL_FILE);
    } catch {
      console.log(`SQL file not found at ${SQL_FILE}, skipping import.`);
      return;
    }

    const connection = await pool.getConnection();
    try {
      console.log('Loading SQL file...');
      await executeSqlFile(SQL_FILE, connection);
      console.log('Database initialized from mdmport_db.sql.');
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error loading SQL:', error.message);
    throw error;
  }
}

async function dumpSqlOnShutdown() {
  try {
    console.log('Creating database dump...');

    await mysqldump({
      connection: {
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
        user: DB_CONFIG.user,
        password: DB_CONFIG.password,
        database: DB_NAME,
      },
      dumpToFile: SQL_FILE,
      dump: {
        schema: {
          table: {
            ifNotExists: true,
            dropIfExists: false
          }
        },
        data: {
          format: false,
          lockTables: false
        }
      }
    });

    console.log(`Database saved to ${SQL_FILE}`);
  } catch (error) {
    console.error('Error creating dump:', error.message);
    throw error;
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', dumpSqlOnShutdown);
process.on('SIGTERM', dumpSqlOnShutdown);

module.exports = {
  pool,
  loadSqlOnStart,
  dumpSqlOnShutdown,
  getConfig: () => ({ ...DB_CONFIG }),
  testConnection: async () => {
    const connection = await pool.getConnection();
    try {
      await connection.ping();
      return true;
    } catch {
      return false;
    } finally {
      connection.release();
    }
  }
};