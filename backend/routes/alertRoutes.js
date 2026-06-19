const express = require('express');
const router = express.Router();
const { getAll, resolve, remove } = require('../controllers/alertController');

router.get('/', getAll);
router.put('/:id/resolve', resolve);
router.delete('/:id', remove);

module.exports = router;
