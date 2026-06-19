const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { getAll, getById, create, update, remove } = require('../controllers/missionController');

const missionValidation = [
  body('name').trim().notEmpty().withMessage('Mission name is required'),
  body('missionCode').trim().notEmpty().withMessage('Mission code is required'),
  body('satellite').notEmpty().withMessage('Assigned satellite is required'),
  body('missionType').isIn(['Observation', 'Communication', 'Navigation', 'Research', 'Defense', 'Commercial']).withMessage('Invalid mission type'),
  body('destinationOrbit').trim().notEmpty().withMessage('Destination orbit is required'),
  body('launchDate').isISO8601().withMessage('Valid launch date is required'),
  body('duration').trim().notEmpty().withMessage('Mission duration is required'),
  body('status').optional().isIn(['Scheduled', 'Active', 'Completed', 'Delayed']).withMessage('Invalid status'),
  validate
];

const updateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Mission name cannot be empty'),
  body('missionCode').optional().trim().notEmpty().withMessage('Mission code cannot be empty'),
  body('satellite').optional().notEmpty().withMessage('Satellite is required'),
  body('missionType').optional().isIn(['Observation', 'Communication', 'Navigation', 'Research', 'Defense', 'Commercial']).withMessage('Invalid mission type'),
  body('destinationOrbit').optional().trim().notEmpty().withMessage('Destination orbit cannot be empty'),
  body('launchDate').optional().isISO8601().withMessage('Valid launch date is required'),
  body('duration').optional().trim().notEmpty().withMessage('Duration cannot be empty'),
  body('status').optional().isIn(['Scheduled', 'Active', 'Completed', 'Delayed']).withMessage('Invalid status'),
  validate
];

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', missionValidation, create);
router.put('/:id', updateValidation, update);
router.delete('/:id', remove);

module.exports = router;
