const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async getAll({ q } = {}) {
    let sql = `SELECT id, username, password FROM users`;
    const params = [];
    if (q) {
      sql += ` WHERE username LIKE ?`;
      params.push(`%${q}%`);
    }
    sql += ` ORDER BY id ASC`;
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  }

  static async create({ username, password }) {
    const hashed = await bcrypt.hash(password, 12);
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
  }

  static async getPreferences(username) {
    try {
      const [rows] = await pool.query('SELECT preferences FROM users WHERE username = ?', [username]);
      if (!rows[0]) return {};
      return rows[0].preferences ? JSON.parse(rows[0].preferences) : {};
    } catch (err) {
      console.error('Hiba a beállítások lekérésekor:', err);
      return {};
    }
  }

  static async updatePreferences(username, preferences) {
    try {
      await pool.query('UPDATE users SET preferences = ? WHERE username = ?', [JSON.stringify(preferences), username]);
    } catch (err) {
      console.error('Hiba a beállítások frissítésekor:', err);
      throw err;
    }
  }
  static async deleteAccount(username) {
  try {
    await pool.query('DELETE FROM users WHERE username = ?', [username]);
  } catch (err) {
    console.error('Hiba a fiók törléskor:', err);
    throw err;
  }
}
}

module.exports = User;