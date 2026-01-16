const User = require('../models/User');
const bcrypt = require('bcrypt');

class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Felhasználónév és jelszó szükséges' });
      }

      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Helytelen felhasználónév vagy jelszó' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Helytelen felhasználónév vagy jelszó' });
      }
      
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email
      };
      
      console.log('Session létrehozva:', req.session.user);

      res.json({
        message: 'Sikeres bejelentkezés',
        user: req.session.user
      });
    } catch (err) {
      console.error('Login hiba:', err);
      res.status(500).json({ message: 'Szerver hiba' });
    }
  }

  static async register(req, res) {
    try {
      const { username, password, confirmPassword } = req.body;

      if (!username || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Összes mező kitöltése szükséges' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Jelszavak nem egyeznek' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Jelszó legalább 6 karakter' });
      }

      const existing = await User.findByUsername(username);
      if (existing) {
        return res.status(409).json({ message: 'Felhasználónév már létezik' });
      }

      await User.create({ username, password });

      res.json({ message: 'Sikeres regisztráció' });
    } catch (err) {
      console.error('Register hiba:', err);
      res.status(500).json({ message: 'Szerver hiba' });
    }
  }
}

module.exports = AuthController;