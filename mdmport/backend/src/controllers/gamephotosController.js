const GamePhoto = require('../models/GamePhoto');

exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await GamePhoto.getAll();
    res.json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
};

exports.getPhotoByGameId = async (req, res) => {
  try {
    const pic = await GamePhoto.getFirstByGameId(req.params.gameid);
    res.json({ pic });
  } catch (err) {
    res.status(500).json({ error: 'Hiba történt' });
  }
};