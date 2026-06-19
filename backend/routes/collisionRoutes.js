const express = require('express');
const router = express.Router();
const { detect } = require('../controllers/collisionController');

router.get('/detect', detect);

module.exports = router;
