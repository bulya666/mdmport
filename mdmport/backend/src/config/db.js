const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const mysqldump = require('mysqldump');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'mdmport_db';
const SQL_FILE = path.join(__dirname, '../../mdmport_db.sql');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  await connection.query(`
    CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci
  `);
  await connection.end();
}

async function isDatabaseEmpty() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(`
      SELECT COUNT(*) AS cnt
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
    `);
    return rows[0].cnt === 0;
  } finally {
    conn.release();
  }
}

async function loadSqlOnStart() {
  try {
    await ensureDatabaseExists();
    const empty = await isDatabaseEmpty();
    if (!empty) {
      console.log('Adatbázis már tartalmaz adatot, SQL import kihagyva.');
      return;
    }

    const sql = await fs.readFile(SQL_FILE, 'utf8');
    const conn = await pool.getConnection();
    await conn.query(sql);
    conn.release();
    console.log('Adatbázis inicializálva a mdmport_db.sql alapján.');
  } catch (err) {
    console.error('Hiba az SQL betöltésekor:', err);
  }
}

async function dumpSqlOnShutdown() {
  try {
    await mysqldump({
      connection: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: DB_NAME,
      },
      dumpToFile: SQL_FILE
    });
    console.log('Adatbázis elmentve a mdmport_db.sql fájlba');
  } catch (err) {
    console.error('Hiba a dump készítésekor:', err);
  } finally {
    process.exit(0);
  }
}

module.exports = { pool, loadSqlOnStart, dumpSqlOnShutdown };