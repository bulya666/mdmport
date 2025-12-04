require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
 const fs = require('fs').promises;
const path = require('path');
const mysqldump = require('mysqldump');

const app = express();
app.use(cors());
app.use(express.json());
 
const PORT = process.env.PORT || 3000;
 
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mdmport_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
 async function findSqlFile() {
  const candidates = [
    path.resolve(__dirname, 'mdmport_db.sql'),
    path.resolve(process.cwd(), 'mdmport_db.sql'),
    path.resolve(__dirname, '..', 'mdmport_db.sql')
  ];
  for (const p of candidates) {
    try {
      const stat = await fs.stat(p);
      if (stat.isFile()) return p;
    } catch (e) {
      // ignore
    }
  }
  return null;
}

async function loadDatabaseFromSqlFile() {
    const sqlPath = await findSqlFile();
  if (!sqlPath) {
    console.log('No mdmport_db.sql found, skipping DB import.');
    return;
  }

    const [rows] = await pool.query(
      'SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = DATABASE()'
    );
    const count = rows && rows[0] && rows[0].cnt ? Number(rows[0].cnt) : 0;

    const force = ['1', 'true', 'yes'].includes((process.env.FORCE_DB_IMPORT || '').toString().toLowerCase());
    console.log('FORCE_DB_IMPORT raw=', process.env.FORCE_DB_IMPORT, ' => force=', force);

if (count > 0 && force) {
  console.log('FORCE_DB_IMPORT -> táblák ürítése');
  await pool.query('SET FOREIGN_KEY_CHECKS=0');
  await pool.query('TRUNCATE TABLE gamephotos');
  await pool.query('TRUNCATE TABLE ownedg');
  await pool.query('TRUNCATE TABLE games');
  await pool.query('TRUNCATE TABLE users');
  await pool.query('SET FOREIGN_KEY_CHECKS=1');
}
  console.log('Loading DB from', sqlPath);
  try {
    const sql = await fs.readFile(sqlPath, 'utf8');
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'mdmport_db',
      multipleStatements: true
    });
    await conn.query(sql);
    await conn.end();
    console.log('Database import finished.');
  } catch (err) {
    console.error('Error importing SQL file:', err);
  }
}

async function dumpDatabaseToSqlFile(outFilename = 'mdmport_db.sql') {
  const outPath = path.resolve(__dirname, outFilename);
  console.log('Dumping DB to', outPath);
  try {
    await mysqldump({
      connection: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'mdmport_db',
      },
      dumpToFile: outPath
    });
    console.log('Database dump finished:', outPath);
  } catch (err) {
    console.error('Error dumping DB:', err);
  }
}

let shuttingDown = false;
async function gracefulShutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  try {
    await dumpDatabaseToSqlFile();
  } catch (e) {
    console.error('Error during graceful shutdown dump:', e);
  } finally {
    process.exit(code);
  }
}

process.on('SIGINT', () => gracefulShutdown(0));
process.on('SIGTERM', () => gracefulShutdown(0));
process.on('uncaughtException', async (err) => {
  console.error('Uncaught exception:', err);
  await gracefulShutdown(1);
});

app.get('/api/games', async (req, res) => {
  try {
    const { tag, q } = req.query;
    let sql = `SELECT id, title, tag, price, \`desc\` AS \`desc\`, thumbnail FROM games`;
    const where = [];
    const params = [];
 
    if (tag && tag !== 'all') {
      where.push('tag LIKE ?');
      params.push(`%${tag}%`);
    }
    if (q) {
      where.push('(title LIKE ? OR `desc` LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }
    if (where.length) {
      sql += ' WHERE ' + where.join(' AND ');
    }
    sql += ' ORDER BY id ASC';
 
    const [rows] = await pool.query(sql, params);
    const parsed = rows.map(r => ({
      id: r.id,
      title: r.title,
      tag: r.tag ? r.tag.split(/\s+/) : [],
      price: r.price,
      desc: r.desc,
      thumbnail: r.thumbnail
    }));
    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/games/:id', async (req, res) => {
  try {
    const gameId = Number(req.params.id);

    if (!Number.isInteger(gameId) || gameId <= 0) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const sql = `
      SELECT  id, title, tag, price, \`desc\` AS \`desc\`, thumbnail
      FROM games
      WHERE id = ?
      LIMIT 1
    `;

    const [rows] = await pool.query(sql, [gameId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'DB error' });
  }
});


app.get('/api/users', async (req, res) => {
  try {
    const { q } = req.query;
 
    let sql = `SELECT id, username, password FROM users`;
    const params = [];
 
    if (q) {
      sql += ` WHERE username LIKE ?`;
      params.push(`%${q}%`);
    }
 
    sql += ` ORDER BY id ASC`;
 
    const [rows] = await pool.query(sql, params);
 
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});
 
 
app.get('/api/ownedg', async (req, res) => {
  try {
    const { userid, gameid } = req.query;
 
    let sql = `SELECT id, userid, gameid FROM ownedg`;
    const params = [];
    const conditions = [];
 
    if (userid) {
      conditions.push(`userid = ?`);
      params.push(userid);
    }
 
    if (gameid) {
      conditions.push(`gameid = ?`);
      params.push(gameid);
    }
 
    if (conditions.length) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }
 
    sql += ` ORDER BY id ASC`;
 
    const [rows] = await pool.query(sql, params);
 
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});
 
 
app.post('/api/ownedg', async (req, res) => {
  try {
    const { userid, gameid } = req.body;
    if (!userid || !gameid) {
      return res.status(400).json({ error: 'Hiányzó userid vagy gameid' });
    }
 
    const [exists] = await pool.query(
      'SELECT id FROM ownedg WHERE userid = ? AND gameid = ?',
      [userid, gameid]
    );
    if (exists.length > 0) {
      return res.json({ success: true, message: 'Már megvan ez a játék a felhasználónak' });
    }
 
    await pool.query(
      'INSERT INTO ownedg (userid, gameid) VALUES (?, ?)',
      [userid, gameid]
    );
 
    res.json({ success: true });
  } catch (err) {
    console.error('DB hiba (POST /api/ownedg):', err);
    res.status(500).json({ error: err.message });
  }
});
 
 
app.get('/api/gamephotos', async (req, res) => {
  try {
    const sql = 'SELECT id, gameid, pic FROM gamephotos ORDER BY gameid, id';
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('Hiba a gamephotos lekérdezésnél:', err);
    res.status(500).json({ error: 'DB error' });
  }
});
 
 
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
 
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Hibás adatok' });
    }
 
    const user = rows[0];
 
 
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Hibás adatok' });
    }
 
    res.json({ success: true, user: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Szerver hiba' });
  }
});
 
 
 
const bcrypt = require('bcrypt');  
 
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
 
    const [exists] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    if (exists.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: 'Felhasználó már létezik' });
    }
 
    const hashed = await bcrypt.hash(password, 12);
 
    await pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashed]
    );
 
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Szerver hiba' });
  }
});
 
 
 
 
app.get('/api/users/byname/:username', async (req, res) => {
  try {
    const username = req.params.username;
    console.log('Lekérdezett user:', username);
 
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      console.log('Nincs ilyen user');
      return res.status(404).json({ error: 'User not found' });
    }
 
    console.log('Talált user:', rows[0]);
    res.json(rows[0]);
  } catch (err) {
    console.error('DB hiba:', err);
    res.status(500).json({ error: err.message });
  }
});
 

app.get('/api/ownedg/:userid', async (req, res) => {
  try {
    const userid = req.params.userid;
    const [rows] = await pool.query('SELECT * FROM ownedg WHERE userid = ?', [userid]);
    res.json(rows);
  } catch (err) {
    console.error('DB hiba (ownedg):', err);
    res.status(500).json({ error: err.message });
  }
});
 
const nodemailer = require('nodemailer');
 
app.post('/send-mail', async (req, res) => {
  const { name, email, subject, message } = req.body;
 
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ status: 'error', message: 'Hiányzó mezők' });
  }
 
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.rackhost.hu',
      port: 465,
      secure: true, 
      auth: {
        user: 'mdmport@leleszedgar.hu',
        pass: 'mdmport2026'
      }
    });
 
    await transporter.sendMail({
      from: `"${name}" <mdmport@leleszedgar.hu>`,
      replyTo: email,
      to: 'mdmport@leleszedgar.hu',
      subject,
      text:
        `Név: ${name}\n` +
        `Feladó e-mail: ${email}\n\n` +
        `Üzenet:\n${message}`
    });
 
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('❌ SMTP hiba:', err);
    res.status(500).json({ status: 'error', message: 'Levélküldési hiba' });
  }
});
 
 
const server = app.listen(PORT, async () => {
  console.log(`mdmport API fut: http://localhost:${PORT}/api/games`);
  console.log(`mdmport API fut: http://localhost:${PORT}/api/users`);
  console.log(`mdmport API fut: http://localhost:${PORT}/api/ownedg`);
  console.log(`mdmport API fut: http://localhost:${PORT}/api/gamephotos`);
  try {
    await loadDatabaseFromSqlFile();
  } catch (e) {
    console.error('Startup DB load error:', e);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use. Indítsd másik porton (pl. PORT=3001) vagy állítsd le a foglaló folyamatot.`);
  } else {
    console.error('Server error:', err);
  }
});