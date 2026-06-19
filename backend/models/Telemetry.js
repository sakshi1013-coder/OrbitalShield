const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
  satellite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Satellite',
    required: [true, 'Satellite reference is required']
  },
  battery: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 100
  },
  temperature: {
    type: Number,
    required: true,
    default: 20
  },
  signalStrength: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 100
  },
  cpuUsage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  communicationStatus: {
    type: String,
    required: true,
    enum: ['Online', 'Intermittent', 'Offline'],
    default: 'Online'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

telemetrySchema.index({ satellite: 1 });

module.exports = mongoose.model('Telemetry', telemetrySchema);
