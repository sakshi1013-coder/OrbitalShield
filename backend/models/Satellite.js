const mongoose = require('mongoose');

const satelliteSchema = new mongoose.Schema({
  satelliteId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Satellite name is required'],
    trim: true
  },
  orbitType: {
    type: String,
    required: [true, 'Orbit type is required'],
    enum: ['LEO', 'MEO', 'GEO', 'HEO', 'SSO', 'Polar']
  },
  altitude: {
    type: Number,
    required: [true, 'Altitude is required'],
    min: [0, 'Altitude must be positive']
  },
  velocity: {
    type: Number,
    required: [true, 'Velocity is required'],
    min: [0, 'Velocity must be positive']
  },
  status: {
    type: String,
    required: true,
    enum: ['Operational', 'Degraded', 'Decommissioned', 'Launching'],
    default: 'Operational'
  },
  launchDate: {
    type: Date,
    required: [true, 'Launch date is required']
  },
  operator: {
    type: String,
    required: [true, 'Operator organization is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  health: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 100
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

satelliteSchema.index({ name: 'text', operator: 'text', country: 'text' });
satelliteSchema.index({ orbitType: 1, status: 1 });

module.exports = mongoose.model('Satellite', satelliteSchema);
