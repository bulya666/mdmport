const { pool } = require('../config/db');

class OwnedGame {
  static async getAll(filters = {}) {
    let sql = `SELECT id, userid, gameid FROM ownedg`;
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
  // src/models/OwnedGame.js
static async getByUserId(userid) {
  userid = Number(userid);
  if (!userid || isNaN(userid)) {
    return []; // vagy dobj hibát
  }

  const [rows] = await pool.query(
    'SELECT id, userid, gameid FROM ownedg WHERE userid = ? ORDER BY id ASC',
    [userid]
  );
  return rows;
}
        // src/models/OwnedGame.js
        static async add(userid, gameid) {
        // FONTOS: userid és gameid legyen szám és érvényes!
        userid = Number(userid);
        gameid = Number(gameid);

        if (!userid || !gameid || isNaN(userid) || isNaN(gameid)) {
            throw new Error('Érvénytelen userid vagy gameid');
        }

        console.log(`[OwnedGame.add] Próbáljuk hozzáadni: user=${userid}, game=${gameid}`);

        const [exists] = await pool.query(
            'SELECT id FROM ownedg WHERE userid = ? AND gameid = ?',
            [userid, gameid]
        );

        if (exists.length > 0) {
            console.log(`[OwnedGame.add] Már létezik: user=${userid}, game=${gameid}`);
            return { alreadyOwned: true };
        }

        await pool.query(
            'INSERT INTO ownedg (userid, gameid) VALUES (?, ?)',
            [userid, gameid]
        );

        console.log(`[OwnedGame.add] Sikeresen hozzáadva: user=${userid}, game=${gameid}`);
        return { alreadyOwned: false };
        }
}

module.exports = OwnedGame;