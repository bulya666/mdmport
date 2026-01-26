const { pool } = require('../config/db');

class Game {
  static async getAll({ tag, q } = {}) {
    let sql = `SELECT id, title, tag, price, \`desc\` AS \`desc\`, thumbnail FROM B_games`;
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
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY id ASC';

    const [rows] = await pool.query(sql, params);
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      tag: r.tag ? r.tag.split(/\s+/) : [],
      price: r.price,
      desc: r.desc,
      thumbnail: r.thumbnail
    }));
  }

  static async getById(id) {
    const [rows] = await pool.query(
      `SELECT id, title, tag, price, \`desc\` AS \`desc\`, thumbnail FROM B_games WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }
}

module.exports = Game;