const satelliteService = require('../services/satelliteService');
const missionService = require('../services/missionService');
const debrisService = require('../services/debrisService');
const telemetryService = require('../services/telemetryService');
const alertService = require('../services/alertService');
const collisionService = require('../services/collisionService');
const logService = require('../services/logService');

class DashboardService {
  async getStats() {
    const [
      totalSatellites,
      operationalSatellites,
      activeMissions,
      trackedDebris,
      totalDebris,
      activeAlerts,
      avgHealth,
      orbitDistribution,
      missionStatusDist,
      healthTrend,
      recentAlerts,
      recentMissions,
      recentLogs
    ] = await Promise.all([
      satelliteService.getCount(),
      satelliteService.getOperationalCount(),
      missionService.getActiveCount(),
      debrisService.getTrackedCount(),
      debrisService.getTotalCount(),
      alertService.getActiveCount(),
      telemetryService.getAverageHealth(),
      satelliteService.getOrbitDistribution(),
      missionService.getStatusDistribution(),
      telemetryService.getHealthTrend(),
      alertService.getRecent(5),
      missionService.getRecent(5),
      logService.getRecent(10)
    ]);

    // Get collision risk distribution
    let collisionRiskDist = [];
    try {
      collisionRiskDist = await collisionService.getRiskDistribution();
    } catch (e) {
      collisionRiskDist = [];
    }

    return {
      summary: {
        totalSatellites,
        operationalSatellites,
        activeMissions,
        trackedDebris,
        totalDebris,
        activeAlerts,
        avgHealth
      },
      charts: {
        orbitDistribution,
        missionStatusDist,
        collisionRiskDist,
        healthTrend
      },
      recentAlerts,
      recentMissions,
      recentLogs
    };
  }
}

module.exports = new DashboardService();
