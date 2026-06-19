const debrisService = require('../services/debrisService');
const { formatResponse, formatPaginatedResponse } = require('../utils/helpers');

const getAll = async (req, res, next) => {
  try {
    const result = await debrisService.getAll(req.query);
    res.json(formatPaginatedResponse(result.debris, result.total, result.page, result.limit));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const debris = await debrisService.getById(req.params.id);
    res.json(formatResponse(debris));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const debris = await debrisService.create(req.body);
    res.status(201).json(formatResponse(debris, 'Debris object created successfully'));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const debris = await debrisService.update(req.params.id, req.body);
    res.json(formatResponse(debris, 'Debris object updated successfully'));
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await debrisService.delete(req.params.id);
    res.json(formatResponse(null, 'Debris object deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
