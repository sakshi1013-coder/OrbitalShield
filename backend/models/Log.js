const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: [true, 'Action is required'],
    trim: true
  },
  entity: {
    type: String,
    required: [true, 'Entity type is required'],
    enum: ['Satellite', 'Mission', 'Debris', 'Collision', 'Alert', 'Telemetry', 'System']
  },
  entityId: {
    type: String,
    trim: true,
    default: ''
  },
  details: {
    type: String,
    required: [true, 'Details are required'],
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

logSchema.index({ action: 'text', details: 'text' });
logSchema.index({ entity: 1, timestamp: -1 });

module.exports = mongoose.model('Log', logSchema);
