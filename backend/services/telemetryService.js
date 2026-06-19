const Telemetry = require('../models/Telemetry');
const Satellite = require('../models/Satellite');
const Log = require('../models/Log');

class TelemetryService {
  async getAll() {
    return Telemetry.find().populate('satellite', 'name satelliteId status orbitType health');
  }

  async getBySatellite(satelliteId) {
    const satellite = await Satellite.findById(satelliteId);
    if (!satellite) {
      const error = new Error('Satellite not found');
      error.statusCode = 404;
      throw error;
    }
    return Telemetry.findOne({ satellite: satelliteId }).populate('satellite', 'name satelliteId status orbitType health');
  }

  async simulateTelemetry() {
    const satellites = await Satellite.find({ status: { $ne: 'Decommissioned' } });
    const results = [];

    for (const sat of satellites) {
      const commStatuses = ['Online', 'Intermittent', 'Offline'];
      const commWeights = [0.7, 0.2, 0.1];
      const rand = Math.random();
      let commStatus;
      if (rand < commWeights[0]) commStatus = commStatuses[0];
      else if (rand < commWeights[0] + commWeights[1]) commStatus = commStatuses[1];
      else commStatus = commStatuses[2];

      const telemetryData = {
        battery: Math.round(Math.random() * 60 + 40), // 40-100
        temperature: Math.round((Math.random() * 80 - 20) * 10) / 10, // -20 to 60
        signalStrength: Math.round(Math.random() * 50 + 50), // 50-100
        cpuUsage: Math.round(Math.random() * 80 + 5), // 5-85
        communicationStatus: commStatus,
        lastUpdated: new Date()
      };

      const telemetry = await Telemetry.findOneAndUpdate(
        { satellite: sat._id },
        { $set: telemetryData },
        { new: true, upsert: true }
      ).populate('satellite', 'name satelliteId status orbitType health');

      results.push(telemetry);
    }

    await Log.create({
      action: 'Telemetry Updated',
      entity: 'Telemetry',
      entityId: '',
      details: `Telemetry simulation updated for ${results.length} satellites`
    });

    return results;
  }

  async getAverageHealth() {
    const telemetry = await Telemetry.find();
    if (telemetry.length === 0) return 0;

    const avgBattery = telemetry.reduce((sum, t) => sum + t.battery, 0) / telemetry.length;
    const avgSignal = telemetry.reduce((sum, t) => sum + t.signalStrength, 0) / telemetry.length;
    const avgHealth = (avgBattery + avgSignal) / 2;

    return Math.round(avgHealth * 10) / 10;
  }

  async getHealthTrend() {
    // Generate simulated trend data for the last 7 data points
    const baseHealth = await this.getAverageHealth() || 75;
    const trend = [];
    const labels = ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'];

    for (let i = 0; i < 7; i++) {
      trend.push({
        label: labels[i],
        health: Math.round((baseHealth + (Math.random() * 10 - 5)) * 10) / 10
      });
    }

    return trend;
  }
}

module.exports = new TelemetryService();
