const express = require('express');
const router = express.Router();

const gamesCtrl = require('../controllers/gamesController');
const usersCtrl = require('../controllers/usersController');
const ownedgCtrl = require('../controllers/ownedgController');
const photosCtrl = require('../controllers/gamephotosController');
const authCtrl = require('../controllers/authController');
const mailCtrl = require('../controllers/mailController');

const { requireAuth } = require("../utils/auth");

router.get('/games', gamesCtrl.getGames);
router.get('/games/:id', gamesCtrl.getGameById);

router.get('/users', usersCtrl.getUsers);
router.get('/users/byname/:username', usersCtrl.getUserByUsername);
router.get("/me", requireAuth, usersCtrl.me);

router.get('/ownedg', ownedgCtrl.getOwnedGames);
router.post('/ownedg', ownedgCtrl.addOwnedGame);
router.get('/ownedg/:userid', ownedgCtrl.getOwnedByUserId);

router.get('/gamephotos', photosCtrl.getAllPhotos);
router.get('/gamephotos/:gameid', photosCtrl.getPhotoByGameId);

router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);
router.post("/logout", authCtrl.logout);

router.post('/send-mail', mailCtrl.sendMail);

module.exports = router;