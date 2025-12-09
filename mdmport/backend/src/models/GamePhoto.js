const { pool } = require('../config/db');

class GamePhoto {
  static async getAll() {
    const [rows] = await pool.query('SELECT id, gameid, pic FROM gamephotos ORDER BY gameid, id');
    return rows;
  }

  static async getFirstByGameId(gameid) {
    const [rows] = await pool.query(
      'SELECT pic FROM gamephotos WHERE gameid = ? ORDER BY id LIMIT 1',
      [gameid]
    );
    return rows[0] ? rows[0].pic : null;
  }
}

module.exports = GamePhoto;