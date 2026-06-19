const satelliteService = require('../services/satelliteService');
const { formatResponse, formatPaginatedResponse } = require('../utils/helpers');

const getAll = async (req, res, next) => {
  try {
    const result = await satelliteService.getAll(req.query);
    res.json(formatPaginatedResponse(result.satellites, result.total, result.page, result.limit));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const satellite = await satelliteService.getById(req.params.id);
    res.json(formatResponse(satellite));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const satellite = await satelliteService.create(req.body);
    res.status(201).json(formatResponse(satellite, 'Satellite created successfully'));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const satellite = await satelliteService.update(req.params.id, req.body);
    res.json(formatResponse(satellite, 'Satellite updated successfully'));
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await satelliteService.delete(req.params.id);
    res.json(formatResponse(null, 'Satellite deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
