const User = require('../models/User');
const bcrypt = require('bcrypt');

class SettingsController {
  static async getPreferences(req, res) {
    try {
      const { username } = req.params;
      
      console.log('Session:', req.session);
      console.log('User:', req.session?.user);
      console.log('Username param:', username);

      if (!req.session?.user) {
        console.warn('Nincs bejelentkezve');
        return res.status(401).json({ message: 'Nincs bejelentkezve' });
      }
      
      if (req.session.user.username !== username) {
        console.warn('Jogosultság ellenőrzés nem sikerült');
        return res.status(403).json({ message: 'Nincs jogosultságod' });
      }

      const preferences = await User.getPreferences(username);
      res.json(preferences);
    } catch (err) {
      console.error('Hiba a beállítások lekérésekor:', err);
      res.status(500).json({ message: 'Szerver hiba' });
    }
  }

  static async updatePreferences(req, res) {
    try {
      const { username } = req.params;
      
      if (!req.session?.user) {
        return res.status(401).json({ message: 'Nincs bejelentkezve' });
      }
      
      if (req.session.user.username !== username) {
        return res.status(403).json({ message: 'Nincs jogosultságod' });
      }

      await User.updatePreferences(username, req.body);
      res.json({ message: 'Beállítások sikeresen mentve', preferences: req.body });
    } catch (err) {
      console.error('Hiba a beállítások mentésekor:', err);
      res.status(500).json({ message: 'Szerver hiba' });
    }
  }

  static async deleteAccount(req, res) {
    try {
      const { username } = req.params;
      const { password } = req.body;
      
      if (!req.session?.user) {
        return res.status(401).json({ message: 'Nincs bejelentkezve' });
      }
      
      if (req.session.user.username !== username) {
        return res.status(403).json({ message: 'Nincs jogosultságod' });
      }

      const result = await User.findByUsername(username);
      if (!result) {
        return res.status(404).json({ message: 'Felhasználó nem található' });
      }

      const passwordMatch = await bcrypt.compare(password, result.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Helytelen jelszó' });
      }

      await User.deleteAccount(username);
      req.session.destroy();
      res.json({ message: 'Fiók sikeresen törölve' });
    } catch (err) {
      console.error('Hiba a fiók törléskor:', err);
      res.status(500).json({ message: 'Szerver hiba' });
    }
  }
}

module.exports = SettingsController;