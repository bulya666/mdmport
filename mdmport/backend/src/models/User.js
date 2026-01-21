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
  static async updateProfile(username, { email }) {
    const updates = [];
    const values = [];

    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }

    if (updates.length === 0) return false;

    values.push(username);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE username = ?`;

    const [result] = await pool.query(sql, values);
    return result.affectedRows > 0;
  }

  static async changePassword(username, currentPlainPassword, newPlainPassword) {
    const user = await this.findByUsername(username);
    if (!user) {
      throw new Error('Felhasználó nem található');
    }

    const isValid = await bcrypt.compare(currentPlainPassword, user.password);
    if (!isValid) {
      throw new Error('Hibás jelenlegi jelszó');
    }

    if (typeof newPlainPassword !== 'string' || newPlainPassword.length < 8) {
      throw new Error('Az új jelszónak legalább 8 karakter hosszúnak kell lennie');
    }

    const hashed = await bcrypt.hash(newPlainPassword, 12);

    await pool.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashed, username]
    );

    return true;
  }
  
  static async deleteByUsernameWithPassword(username, plainPassword) {
  const user = await this.findByUsername(username);
  if (!user) {
    throw new Error('Felhasználó nem található');
  }

  const isValid = await bcrypt.compare(plainPassword, user.password);
  if (!isValid) {
    throw new Error('Hibás jelszó');
  }

  const [result] = await pool.query(
    'DELETE FROM users WHERE username = ?',
    [username]
  );

  if (result.affectedRows === 0) {
    throw new Error('Törlés sikertelen – felhasználó nem létezik');
  }

  return true;
}
}

module.exports = User;