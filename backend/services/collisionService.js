const Satellite = require('../models/Satellite');
const Debris = require('../models/Debris');
const Alert = require('../models/Alert');
const Log = require('../models/Log');
const { generateAlertId } = require('../utils/helpers');

class CollisionService {
  async detectCollisions() {
    const satellites = await Satellite.find({ status: { $ne: 'Decommissioned' } });
    const allDebris = await Debris.find({ trackingStatus: { $ne: 'Lost' } });

    const results = [];

    for (const sat of satellites) {
      for (const deb of allDebris) {
        const altDiff = Math.abs(sat.altitude - deb.altitude);

        let risk, recommendedAction, color;

        if (altDiff < 5) {
          risk = 'HIGH';
          recommendedAction = 'Immediate collision avoidance maneuver required';
          color = 'red';
        } else if (altDiff <= 15) {
          risk = 'MEDIUM';
          recommendedAction = 'Monitor closely and prepare avoidance trajectory';
          color = 'yellow';
        } else {
          continue; // Skip SAFE pairs to keep results manageable
        }

        results.push({
          satellite: {
            _id: sat._id,
            name: sat.name,
            satelliteId: sat.satelliteId,
            altitude: sat.altitude
          },
          debris: {
            _id: deb._id,
            objectName: deb.objectName,
            debrisId: deb.debrisId,
            altitude: deb.altitude
          },
          altitudeDifference: Math.round(altDiff * 100) / 100,
          risk,
          recommendedAction,
          color
        });

        // Auto-generate alert for HIGH risk
        if (risk === 'HIGH') {
          const existingAlert = await Alert.findOne({
            satellite: sat._id,
            debris: deb._id,
            status: 'Active'
          });

          if (!existingAlert) {
            const alert = await Alert.create({
              alertId: generateAlertId(),
              satellite: sat._id,
              debris: deb._id,
              riskLevel: 'HIGH',
              status: 'Active'
            });

            await Log.create({
              action: 'Alert Generated',
              entity: 'Alert',
              entityId: alert.alertId,
              details: `HIGH risk collision alert generated for "${sat.name}" and debris "${deb.objectName}" (altitude diff: ${altDiff.toFixed(2)} km)`
            });
          }
        }
      }
    }

    if (results.length > 0) {
      await Log.create({
        action: 'Collision Detection',
        entity: 'Collision',
        entityId: '',
        details: `Collision detection scan completed. Found ${results.length} potential conflicts (${results.filter(r => r.risk === 'HIGH').length} HIGH, ${results.filter(r => r.risk === 'MEDIUM').length} MEDIUM)`
      });
    }

    // Sort by risk (HIGH first) then by altitude difference
    results.sort((a, b) => {
      if (a.risk === 'HIGH' && b.risk !== 'HIGH') return -1;
      if (a.risk !== 'HIGH' && b.risk === 'HIGH') return 1;
      return a.altitudeDifference - b.altitudeDifference;
    });

    return results;
  }

  async getRiskDistribution() {
    const results = await this.detectCollisions();
    const high = results.filter(r => r.risk === 'HIGH').length;
    const medium = results.filter(r => r.risk === 'MEDIUM').length;
    return [
      { _id: 'HIGH', count: high },
      { _id: 'MEDIUM', count: medium }
    ];
  }
}

module.exports = new CollisionService();
