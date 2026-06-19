const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/logController');

router.get('/', getAll);

module.exports = router;
