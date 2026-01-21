const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/settingsController');
const User = require('../models/User');

router.get('/users/:username/preferences', SettingsController.getPreferences);
router.put('/users/:username/preferences', SettingsController.updatePreferences);
router.delete('/users/:username', SettingsController.deleteAccount);
router.put('/users/:username', async (req, res) => {
  const { username } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Jelenlegi és új jelszó megadása kötelező'
    });
  }

  try {
    await User.changePassword(username, currentPassword, newPassword);
    res.json({
      success: true,
      message: 'Jelszó sikeresen megváltoztatva'
    });
  } catch (err) {
    console.error('Jelszóváltoztatási hiba:', err.message);

    let status = 500;
    let message = 'Szerver hiba';

    if (err.message.includes('Hibás jelenlegi jelszó')) {
      status = 401;
      message = err.message;
    } else if (err.message.includes('legalább 8 karakter')) {
      status = 400;
      message = err.message;
    }

    res.status(status).json({ success: false, message });
  }
  router.delete('/users/:username', async (req, res) => {
  const { username } = req.params;
    const { currentPassword } = req.body; 

  if (!currentPassword) {
    return res.status(400).json({
      success: false,
      message: 'Jelszó megadása kötelező a törléshez'
    });
  }

  try {
    await User.deleteByUsernameWithPassword(username, currentPassword);
    res.json({
      success: true,
      message: 'Fiók sikeresen törölve'
    });
  } catch (err) {
    console.error('Fiók törlési hiba:', err.message);

    let status = 500;
    let message = 'Szerver hiba';

    if (err.message === 'Hibás jelszó') {
      status = 401;
      message = 'Hibás jelszó – a fiók nem törölhető';
    } else if (err.message.includes('nem található')) {
      status = 404;
      message = err.message;
    }

    res.status(status).json({ success: false, message });
  }
});
});
module.exports = router;