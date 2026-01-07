const User = require('../models/User');
const bcrypt = require('bcrypt');
const { pool } = require("../config/db");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    if (!user) return res.status(401).json({ success: false, message: 'Hibás adatok' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Hibás adatok' });

    req.session.userId = user.id;
    req.session.username = user.username;

    console.log('Session tartalma mentés előtt:', req.session);
    console.log('Session sikeresen elmentve, tartalom:', req.session);

    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regenerate hiba:', err);
        return res.status(500).json({ success: false, message: 'Szerver hiba' });
      }

      req.session.userId = user.id;
      req.session.username = user.username;

      req.session.touch();

      req.session.save(async(err) => {
        if (err) {
          console.error('Session save hiba:', err);
          return res.status(500).json({ success: false, message: 'Szerver hiba' });
        }
        
        res.json({ success: true, user: user.username });
      });
    });
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

exports.logout = (req, res) => {

  if (req.session) {
    store.destroy(req.sessionID, (err) => {
      if (err) {
        console.error('Session destroy hiba az adatbázisban:', err);
      }
    });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy hiba:', err);
      return res.status(500).json({ success: false, message: 'Kijelentkezés sikertelen' });
    }

    res.clearCookie('connect.sid'); 

    res.status(204).send(); 
  });
};

exports.getCurrentUser = (req, res) => {
  if (!req.session.userId || !req.session.username) {
    return res.status(401).json({ success: false, message: 'Nem vagy bejelentkezve' });
  }

  res.json({
    success: true,
    user: {
      username: req.session.username,
    }
  });
};