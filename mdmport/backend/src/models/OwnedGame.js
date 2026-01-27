const { pool } = require('../config/db');

class OwnedGame {
  static async getAll(filters = {}) {
    let sql = `SELECT id, userid, gameid FROM D_ownedg`;
    const conditions = [];
    const params = [];

    if (filters.userid) {
      conditions.push('userid = ?');
      params.push(filters.userid);
    }
    if (filters.gameid) {
      conditions.push('gameid = ?');
      params.push(filters.gameid);
    }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY id ASC';

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async getByUserId(userid) {
    userid = Number(userid);
    if (!userid || isNaN(userid)) {
      return [];
    }

    const [rows] = await pool.query(
      'SELECT id, userid, gameid FROM D_ownedg WHERE userid = ? ORDER BY id ASC',
      [userid]
    );
    return rows;
  }
  static async add(userid, gameid) {

    userid = Number(userid);
    gameid = Number(gameid);

    if (!userid || !gameid || isNaN(userid) || isNaN(gameid)) {
      throw new Error('Érvénytelen userid vagy gameid');
    }

    console.log(`[OwnedGame.add] Próbáljuk hozzáadni: user=${userid}, game=${gameid}`);
    const sql = 'INSERT IGNORE INTO D_ownedg (userid, gameid) VALUES (?, ?)';
    const params = [userid, gameid];
    const maxRetries = 3;
    let attempt = 0;
    while (true) {
      try {
        const [result] = await pool.query(sql, params);

        if (result.affectedRows === 0) {
          console.log(`[OwnedGame.add] Már létezik: user=${userid}, game=${gameid}`);
          return { alreadyOwned: true };
        }

        console.log(`[OwnedGame.add] Hozzáadva: user=${userid}, game=${gameid}`);
        return { alreadyOwned: false };
      } catch (err) {
        if (err && err.code === 'ER_LOCK_DEADLOCK' && attempt < maxRetries) {
          attempt++;
          const delay = 50 * Math.pow(2, attempt);
          console.warn(`[OwnedGame.add] Deadlock, retry ${attempt}/${maxRetries} after ${delay}ms`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw err;
      }
    }
  }
}


module.exports = OwnedGame;