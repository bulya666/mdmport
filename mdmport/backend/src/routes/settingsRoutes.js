const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/settingsController');

router.get('/users/:username/preferences', SettingsController.getPreferences);
router.put('/users/:username/preferences', SettingsController.updatePreferences);
router.delete('/users/:username', SettingsController.deleteAccount);

module.exports = router;