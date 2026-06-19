const telemetryService = require('../services/telemetryService');
const { formatResponse } = require('../utils/helpers');

const getAll = async (req, res, next) => {
  try {
    const telemetry = await telemetryService.getAll();
    res.json(formatResponse(telemetry));
  } catch (error) {
    next(error);
  }
};

const getBySatellite = async (req, res, next) => {
  try {
    const telemetry = await telemetryService.getBySatellite(req.params.satelliteId);
    res.json(formatResponse(telemetry));
  } catch (error) {
    next(error);
  }
};

const simulate = async (req, res, next) => {
  try {
    const results = await telemetryService.simulateTelemetry();
    res.json(formatResponse(results, 'Telemetry simulation complete'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getBySatellite, simulate };
