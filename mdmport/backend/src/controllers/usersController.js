const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAll(req.query);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findByUsername(req.params.username);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.json({
    id: user.id,
    username: user.username
  });
};
