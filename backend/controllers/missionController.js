const missionService = require('../services/missionService');
const { formatResponse, formatPaginatedResponse } = require('../utils/helpers');

const getAll = async (req, res, next) => {
  try {
    const result = await missionService.getAll(req.query);
    res.json(formatPaginatedResponse(result.missions, result.total, result.page, result.limit));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const mission = await missionService.getById(req.params.id);
    res.json(formatResponse(mission));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const mission = await missionService.create(req.body);
    res.status(201).json(formatResponse(mission, 'Mission created successfully'));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const mission = await missionService.update(req.params.id, req.body);
    res.json(formatResponse(mission, 'Mission updated successfully'));
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await missionService.delete(req.params.id);
    res.json(formatResponse(null, 'Mission deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
