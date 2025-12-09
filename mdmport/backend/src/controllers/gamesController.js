const Game = require('../models/Game');

exports.getGames = async (req, res) => {
  try {
    const games = await Game.getAll(req.query);
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
};

exports.getGameById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid ID' });

    const game = await Game.getById(id);
    if (!game) return res.status(404).json({ error: 'Not found' });

    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
};