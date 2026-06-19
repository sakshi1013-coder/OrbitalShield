const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { getAll, getById, create, update, remove } = require('../controllers/satelliteController');

const satelliteValidation = [
  body('name').trim().notEmpty().withMessage('Satellite name is required'),
  body('orbitType').isIn(['LEO', 'MEO', 'GEO', 'HEO', 'SSO', 'Polar']).withMessage('Invalid orbit type'),
  body('altitude').isFloat({ min: 0 }).withMessage('Altitude must be a positive number'),
  body('velocity').isFloat({ min: 0 }).withMessage('Velocity must be a positive number'),
  body('status').optional().isIn(['Operational', 'Degraded', 'Decommissioned', 'Launching']).withMessage('Invalid status'),
  body('launchDate').isISO8601().withMessage('Valid launch date is required'),
  body('operator').trim().notEmpty().withMessage('Operator organization is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('health').optional().isFloat({ min: 0, max: 100 }).withMessage('Health must be between 0 and 100'),
  validate
];

const updateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Satellite name cannot be empty'),
  body('orbitType').optional().isIn(['LEO', 'MEO', 'GEO', 'HEO', 'SSO', 'Polar']).withMessage('Invalid orbit type'),
  body('altitude').optional().isFloat({ min: 0 }).withMessage('Altitude must be a positive number'),
  body('velocity').optional().isFloat({ min: 0 }).withMessage('Velocity must be a positive number'),
  body('status').optional().isIn(['Operational', 'Degraded', 'Decommissioned', 'Launching']).withMessage('Invalid status'),
  body('launchDate').optional().isISO8601().withMessage('Valid launch date is required'),
  body('operator').optional().trim().notEmpty().withMessage('Operator cannot be empty'),
  body('country').optional().trim().notEmpty().withMessage('Country cannot be empty'),
  body('health').optional().isFloat({ min: 0, max: 100 }).withMessage('Health must be between 0 and 100'),
  validate
];

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', satelliteValidation, create);
router.put('/:id', updateValidation, update);
router.delete('/:id', remove);

module.exports = router;
