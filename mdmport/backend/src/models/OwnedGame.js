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
       try {
      // Atomi beszúrás: csak akkor szúr be, ha még nincs ilyen sor
      const sql = `
        INSERT INTO ownedg (userid, gameid)
        SELECT ?, ?
        FROM DUAL
        WHERE NOT EXISTS (
          SELECT 1 FROM ownedg WHERE userid = ? AND gameid = ?
        )
      `;
      const [result] = await pool.query(sql, [userid, gameid, userid, gameid]);

      if (result.affectedRows === 0) {
        console.log(`[OwnedGame.add] Már létezik: user=${userid}, game=${gameid}`);
        return { alreadyOwned: true };
      }

      console.log(`[OwnedGame.add] Hozzáadva: user=${userid}, game=${gameid}`);
      return { alreadyOwned: false };
    } catch (err) {
      // Ha van unique index és mégis duplikát hiba jön, jelöljük már birtokoltnak
      if (err && err.code === 'ER_DUP_ENTRY') {
        return { alreadyOwned: true };
      }
      throw err;
    }
  }
}

module.exports = OwnedGame;