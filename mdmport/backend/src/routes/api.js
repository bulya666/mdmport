const express = require('express');
const router = express.Router();
const User = require('../models/User');

const gamesCtrl = require('../controllers/gamesController');
const usersCtrl = require('../controllers/usersController');
const ownedgCtrl = require('../controllers/ownedgController');
const photosCtrl = require('../controllers/gamephotosController');
const authCtrl = require('../controllers/authController');
const mailCtrl = require('../controllers/mailController');

const settingsRoutes = require('./settingsRoutes');

router.get('/games', gamesCtrl.getGames);
router.get('/games/:id', gamesCtrl.getGameById);

router.get('/users', usersCtrl.getUsers);
router.get('/users/byname/:username', usersCtrl.getUserByUsername);

router.get('/ownedg', ownedgCtrl.getOwnedGames);
router.post('/ownedg', ownedgCtrl.addOwnedGame);
router.get('/ownedg/:userid', ownedgCtrl.getOwnedByUserId);
router.post('/ownedg/checkout', ownedgCtrl.checkout);

router.get('/gamephotos', photosCtrl.getAllPhotos);
router.get('/gamephotos/:gameid', photosCtrl.getPhotoByGameId);

router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);

router.post('/send-mail', mailCtrl.sendMail);

router.use('/settings', settingsRoutes);
router.put('/users/:username/password', async (req, res) => {
  const { username } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Mindkét jelszó kötelező' });
  }

  try {
    await User.changePassword(username, currentPassword, newPassword);
    res.json({ success: true, message: 'Jelszó sikeresen megváltoztatva' });
  } catch (err) {
    console.error('Jelszóváltoztatási hiba:', err.message);
    const status = err.message.includes('Hibás jelenlegi jelszó') ? 401 :
      err.message.includes('legalább') ? 400 : 500;
    res.status(status).json({ success: false, message: err.message || 'Szerver hiba' });
  }
});
router.delete('/users/:username', async (req, res) => {
  const { username } = req.params;
  const { currentPassword } = req.body;

  if (!currentPassword?.trim()) {
    return res.status(400).json({ success: false, message: 'Jelszó megadása kötelező' });
  }

  try {
    await User.deleteByUsernameWithPassword(username, currentPassword);
    res.json({ success: true, message: 'Fiók sikeresen törölve' });
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

module.exports = router;