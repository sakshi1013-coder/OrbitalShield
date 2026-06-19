const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { getAll, getById, create, update, remove } = require('../controllers/debrisController');

const debrisValidation = [
  body('objectName').trim().notEmpty().withMessage('Object name is required'),
  body('altitude').isFloat({ min: 0 }).withMessage('Altitude must be a positive number'),
  body('velocity').isFloat({ min: 0 }).withMessage('Velocity must be a positive number'),
  body('objectSize').isIn(['Small (<10cm)', 'Medium (10cm-1m)', 'Large (>1m)']).withMessage('Invalid object size'),
  body('riskCategory').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid risk category'),
  body('trackingStatus').optional().isIn(['Tracked', 'Untracked', 'Lost']).withMessage('Invalid tracking status'),
  body('countryOfOrigin').trim().notEmpty().withMessage('Country of origin is required'),
  validate
];

const updateValidation = [
  body('objectName').optional().trim().notEmpty().withMessage('Object name cannot be empty'),
  body('altitude').optional().isFloat({ min: 0 }).withMessage('Altitude must be a positive number'),
  body('velocity').optional().isFloat({ min: 0 }).withMessage('Velocity must be a positive number'),
  body('objectSize').optional().isIn(['Small (<10cm)', 'Medium (10cm-1m)', 'Large (>1m)']).withMessage('Invalid object size'),
  body('riskCategory').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid risk category'),
  body('trackingStatus').optional().isIn(['Tracked', 'Untracked', 'Lost']).withMessage('Invalid tracking status'),
  body('countryOfOrigin').optional().trim().notEmpty().withMessage('Country cannot be empty'),
  validate
];

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', debrisValidation, create);
router.put('/:id', updateValidation, update);
router.delete('/:id', remove);

module.exports = router;
