const Satellite = require('../models/Satellite');
const Log = require('../models/Log');
const { generateSatelliteId } = require('../utils/helpers');

class SatelliteService {
  async getAll(query = {}) {
    const {
      search = '',
      orbitType = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { satelliteId: { $regex: search, $options: 'i' } },
        { operator: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } }
      ];
    }

    if (orbitType) filter.orbitType = orbitType;
    if (status) filter.status = status;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [satellites, total] = await Promise.all([
      Satellite.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Satellite.countDocuments(filter)
    ]);

    return { satellites, total, page: parseInt(page), limit: parseInt(limit) };
  }

  async getById(id) {
    const satellite = await Satellite.findById(id);
    if (!satellite) {
      const error = new Error('Satellite not found');
      error.statusCode = 404;
      throw error;
    }
    return satellite;
  }

  async create(data) {
    data.satelliteId = generateSatelliteId();
    const satellite = await Satellite.create(data);

    await Log.create({
      action: 'Satellite Created',
      entity: 'Satellite',
      entityId: satellite.satelliteId,
      details: `Satellite "${satellite.name}" (${satellite.satelliteId}) was created`
    });

    return satellite;
  }

  async update(id, data) {
    const satellite = await Satellite.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!satellite) {
      const error = new Error('Satellite not found');
      error.statusCode = 404;
      throw error;
    }

    await Log.create({
      action: 'Satellite Updated',
      entity: 'Satellite',
      entityId: satellite.satelliteId,
      details: `Satellite "${satellite.name}" (${satellite.satelliteId}) was updated`
    });

    return satellite;
  }

  async delete(id) {
    const satellite = await Satellite.findByIdAndDelete(id);

    if (!satellite) {
      const error = new Error('Satellite not found');
      error.statusCode = 404;
      throw error;
    }

    await Log.create({
      action: 'Satellite Deleted',
      entity: 'Satellite',
      entityId: satellite.satelliteId,
      details: `Satellite "${satellite.name}" (${satellite.satelliteId}) was deleted`
    });

    return satellite;
  }

  async getCount() {
    return Satellite.countDocuments();
  }

  async getOperationalCount() {
    return Satellite.countDocuments({ status: 'Operational' });
  }

  async getOrbitDistribution() {
    return Satellite.aggregate([
      { $group: { _id: '$orbitType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  }
}

module.exports = new SatelliteService();
