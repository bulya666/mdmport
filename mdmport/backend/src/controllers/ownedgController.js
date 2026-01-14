const OwnedGame = require('../models/OwnedGame');
const { pool } = require('../config/db');

exports.getOwnedGames = async (req, res) => {
  try {
    const owned = await OwnedGame.getAll(req.query);
    res.json(owned);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
};

exports.addOwnedGame = async (req, res) => {
  try {
    let { userid, gameid } = req.body;

    userid = Number(userid);
    gameid = Number(gameid);

    if (!userid || !gameid || isNaN(userid) || isNaN(gameid)) {
      return res.status(400).json({
        success: false,
        error: 'Érvénytelen userid vagy gameid'
      });
    }

    const result = await OwnedGame.add(userid, gameid);

    if (result.alreadyOwned) {
      return res.json({
        success: false,
        alreadyOwned: true,
        message: 'Már birtoklod ezt a játékot'
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Vásárlási hiba:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.getOwnedByUserId = async (req, res) => {
  try {
    const userid = Number(req.params.userid);

    if (!userid || isNaN(userid) || userid <= 0) {
      return res.status(400).json({ error: 'Érvénytelen felhasználói azonosító' });
    }

    const owned = await OwnedGame.getByUserId(userid);
    res.json(owned);
  } catch (err) {
    console.error('Hiba a birtokolt játékok lekérdezésénél:', err);
    res.status(500).json({ error: 'Szerver hiba' });
  }
};
exports.checkout = async (req, res) => {
  try {
    const { userid, gameids } = req.body;
    const uid = Number(userid);
    if (!uid || !Array.isArray(gameids) || gameids.length === 0) {
      return res.status(400).json({ success: false, error: 'Érvénytelen userid vagy gameids' });
    }

    const ids = Array.from(new Set(gameids.map(x => Number(x)).filter(x => !isNaN(x))));
    if (ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Nincsenek érvényes gameid-k' });
    }

    const MAX_RETRIES = 3;
    let attempt = 0;

    while (true) {
      attempt++;
      const conn = await pool.getConnection();
      try {
        await conn.query('START TRANSACTION');

        const placeholders = ids.map(() => '?').join(',');
        const [existingRows] = await conn.query(
          `SELECT gameid FROM ownedg WHERE userid = ? AND gameid IN (${placeholders})`,
          [uid, ...ids]
        );
        const existingSet = new Set(existingRows.map(r => r.gameid));

        const toInsert = ids.filter(id => !existingSet.has(id));
        if (toInsert.length > 0) {
          const vals = [];
          const ph = toInsert.map(() => '(?,?)').join(',');
          toInsert.forEach(id => {
            vals.push(uid, id);
          });
          const insertSql = `INSERT INTO ownedg (userid, gameid) VALUES ${ph}`;
          await conn.query(insertSql, vals);
        }

        await conn.query('COMMIT');

        const inserted = toInsert;
        const alreadyOwned = ids.filter(id => existingSet.has(id));

        conn.release();
        return res.json({
          success: true,
          inserted,
          alreadyOwned
        });
      } catch (err) {
        try { await conn.query('ROLLBACK'); } catch (e) { /* ignore */ }
        conn.release();

        if ((err && (err.code === 'ER_LOCK_DEADLOCK' || err.sqlState === '40001')) && attempt < MAX_RETRIES) {
          const backoff = 50 * Math.pow(2, attempt - 1);
          await new Promise(r => setTimeout(r, backoff));
          continue;
        }

        if (err && err.code === 'ER_DUP_ENTRY') {
          return res.json({ success: true, inserted: [], alreadyOwned: ids });
        }

        console.error('Checkout hiba:', err);
        return res.status(500).json({ success: false, error: err.message || 'Váratlan hiba' });
      }
    }
  } catch (err) {
    console.error('Checkout unexpected:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};