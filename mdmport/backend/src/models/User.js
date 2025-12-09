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
}

module.exports = User;