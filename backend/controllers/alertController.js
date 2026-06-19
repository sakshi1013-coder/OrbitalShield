const alertService = require('../services/alertService');
const { formatResponse, formatPaginatedResponse } = require('../utils/helpers');

const getAll = async (req, res, next) => {
  try {
    const result = await alertService.getAll(req.query);
    res.json(formatPaginatedResponse(result.alerts, result.total, result.page, result.limit));
  } catch (error) {
    next(error);
  }
};

const resolve = async (req, res, next) => {
  try {
    const alert = await alertService.resolve(req.params.id, req.body.operatorNotes);
    res.json(formatResponse(alert, 'Alert resolved successfully'));
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await alertService.delete(req.params.id);
    res.json(formatResponse(null, 'Alert deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, resolve, remove };
