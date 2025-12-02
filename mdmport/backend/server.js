require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

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
    console.error('❌ DB hiba (POST /api/ownedg):', err);
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
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Hibás adatok' });
    }
    res.json({ success: true, user: rows[0].username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Szerver hiba' });
  }
});


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
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [
      username,
      password,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Szerver hiba' });
  }
});


app.get('/api/users/byname/:username', async (req, res) => {
  try {
    const username = req.params.username;
    console.log('🔹 Lekérdezett user:', username);

    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      console.log('⚠️ Nincs ilyen user');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ Talált user:', rows[0]);
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ DB hiba:', err);
    res.status(500).json({ error: err.message });
  }
});

// Egyedi felhasználóhoz tartozó ownedg rekordok lekérése userID alapján
app.get('/api/ownedg/:userid', async (req, res) => {
  try {
    const userid = req.params.userid;
    const [rows] = await pool.query('SELECT * FROM ownedg WHERE userid = ?', [userid]);
    res.json(rows);
  } catch (err) {
    console.error('❌ DB hiba (ownedg):', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`mdmport API fut: http://localhost:${PORT}/api/games`);
    console.log(`mdmport API fut: http://localhost:${PORT}/api/users`);
  console.log(`mdmport API fut: http://localhost:${PORT}/api/ownedg`);
    console.log(`mdmport API fut: http://localhost:${PORT}/api/gamephotos`);
});