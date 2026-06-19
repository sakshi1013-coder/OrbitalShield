const dashboardService = require('../services/dashboardService');
const { formatResponse } = require('../utils/helpers');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    res.json(formatResponse(stats));
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
