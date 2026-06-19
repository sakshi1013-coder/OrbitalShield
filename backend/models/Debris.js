const mongoose = require('mongoose');

const debrisSchema = new mongoose.Schema({
  debrisId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  objectName: {
    type: String,
    required: [true, 'Object name is required'],
    trim: true
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
  objectSize: {
    type: String,
    required: [true, 'Object size is required'],
    enum: ['Small (<10cm)', 'Medium (10cm-1m)', 'Large (>1m)']
  },
  riskCategory: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  trackingStatus: {
    type: String,
    required: true,
    enum: ['Tracked', 'Untracked', 'Lost'],
    default: 'Tracked'
  },
  countryOfOrigin: {
    type: String,
    required: [true, 'Country of origin is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

debrisSchema.index({ objectName: 'text', countryOfOrigin: 'text' });
debrisSchema.index({ riskCategory: 1, trackingStatus: 1 });

module.exports = mongoose.model('Debris', debrisSchema);
