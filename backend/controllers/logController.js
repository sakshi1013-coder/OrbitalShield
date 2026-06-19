const logService = require('../services/logService');
const { formatPaginatedResponse } = require('../utils/helpers');

const getAll = async (req, res, next) => {
  try {
    const result = await logService.getAll(req.query);
    res.json(formatPaginatedResponse(result.logs, result.total, result.page, result.limit));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll };
