const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/settingsController');
const User = require('../models/User');

router.get('/users/:username/preferences', SettingsController.getPreferences);
router.put('/users/:username/preferences', SettingsController.updatePreferences);

module.exports = router;