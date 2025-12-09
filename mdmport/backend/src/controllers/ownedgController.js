const OwnedGame = require('../models/OwnedGame');

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
      // EZ A FONTOS: már birtokolja → 409 Conflict
      return res.status(409).json({
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