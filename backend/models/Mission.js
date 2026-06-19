const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  missionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Mission name is required'],
    trim: true
  },
  missionCode: {
    type: String,
    required: [true, 'Mission code is required'],
    trim: true,
    uppercase: true
  },
  satellite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Satellite',
    required: [true, 'Assigned satellite is required']
  },
  missionType: {
    type: String,
    required: [true, 'Mission type is required'],
    enum: ['Observation', 'Communication', 'Navigation', 'Research', 'Defense', 'Commercial']
  },
  destinationOrbit: {
    type: String,
    required: [true, 'Destination orbit is required'],
    trim: true
  },
  launchDate: {
    type: Date,
    required: [true, 'Launch date is required']
  },
  duration: {
    type: String,
    required: [true, 'Mission duration is required'],
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Scheduled', 'Active', 'Completed', 'Delayed'],
    default: 'Scheduled'
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

missionSchema.index({ name: 'text', missionCode: 'text' });
missionSchema.index({ status: 1, missionType: 1 });

module.exports = mongoose.model('Mission', missionSchema);
