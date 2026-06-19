const Debris = require('../models/Debris');
const Log = require('../models/Log');
const { generateDebrisId } = require('../utils/helpers');

class DebrisService {
  async getAll(query = {}) {
    const {
      search = '',
      riskCategory = '',
      trackingStatus = '',
      objectSize = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = query;

    const filter = {};

    if (search) {
      filter.$or = [
        { objectName: { $regex: search, $options: 'i' } },
        { debrisId: { $regex: search, $options: 'i' } },
        { countryOfOrigin: { $regex: search, $options: 'i' } }
      ];
    }

    if (riskCategory) filter.riskCategory = riskCategory;
    if (trackingStatus) filter.trackingStatus = trackingStatus;
    if (objectSize) filter.objectSize = objectSize;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [debris, total] = await Promise.all([
      Debris.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Debris.countDocuments(filter)
    ]);

    return { debris, total, page: parseInt(page), limit: parseInt(limit) };
  }

  async getById(id) {
    const debris = await Debris.findById(id);
    if (!debris) {
      const error = new Error('Debris not found');
      error.statusCode = 404;
      throw error;
    }
    return debris;
  }

  async create(data) {
    data.debrisId = generateDebrisId();
    const debris = await Debris.create(data);

    await Log.create({
      action: 'Debris Created',
      entity: 'Debris',
      entityId: debris.debrisId,
      details: `Debris "${debris.objectName}" (${debris.debrisId}) was added to tracking`
    });

    return debris;
  }

  async update(id, data) {
    const debris = await Debris.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!debris) {
      const error = new Error('Debris not found');
      error.statusCode = 404;
      throw error;
    }

    await Log.create({
      action: 'Debris Updated',
      entity: 'Debris',
      entityId: debris.debrisId,
      details: `Debris "${debris.objectName}" (${debris.debrisId}) was updated`
    });

    return debris;
  }

  async delete(id) {
    const debris = await Debris.findByIdAndDelete(id);

    if (!debris) {
      const error = new Error('Debris not found');
      error.statusCode = 404;
      throw error;
    }

    await Log.create({
      action: 'Debris Deleted',
      entity: 'Debris',
      entityId: debris.debrisId,
      details: `Debris "${debris.objectName}" (${debris.debrisId}) was removed from tracking`
    });

    return debris;
  }

  async getTrackedCount() {
    return Debris.countDocuments({ trackingStatus: 'Tracked' });
  }

  async getTotalCount() {
    return Debris.countDocuments();
  }
}

module.exports = new DebrisService();
