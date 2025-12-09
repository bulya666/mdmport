const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    if (!user) return res.status(401).json({ success: false, message: 'Hibás adatok' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Hibás adatok' });

    res.json({ success: true, user: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Szerver hiba' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const exists = await User.findByUsername(username);
    if (exists) return res.status(409).json({ success: false, message: 'Felhasználó már létezik' });

    await User.create({ username, password });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Szerver hiba' });
  }
};