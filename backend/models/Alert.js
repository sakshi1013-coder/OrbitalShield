const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  satellite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Satellite',
    required: [true, 'Satellite reference is required']
  },
  debris: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Debris',
    required: [true, 'Debris reference is required']
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['HIGH', 'MEDIUM']
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Resolved'],
    default: 'Active'
  },
  operatorNotes: {
    type: String,
    trim: true,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

alertSchema.index({ status: 1, riskLevel: 1 });

module.exports = mongoose.model('Alert', alertSchema);
