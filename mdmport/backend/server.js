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

// 🔹 Összes kép lekérése a gamephotos táblából
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


app.listen(PORT, () => {
  console.log(`mdmport API fut: http://localhost:${PORT}/api/games`);
    console.log(`mdmport API fut: http://localhost:${PORT}/api/users`);
  console.log(`mdmport API fut: http://localhost:${PORT}/api/ownedg`);
    console.log(`mdmport API fut: http://localhost:${PORT}/api/gamephotos`);

});