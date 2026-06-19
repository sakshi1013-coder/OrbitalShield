const express = require('express');
const router = express.Router();
const { getAll, getBySatellite, simulate } = require('../controllers/telemetryController');

router.get('/', getAll);
router.get('/satellite/:satelliteId', getBySatellite);
router.post('/simulate', simulate);

module.exports = router;
