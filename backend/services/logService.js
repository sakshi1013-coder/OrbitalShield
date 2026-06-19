const Log = require('../models/Log');

class LogService {
  async getAll(query = {}) {
    const {
      search = '',
      entity = '',
      sortBy = 'timestamp',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = query;

    const filter = {};

    if (search) {
      filter.$or = [
        { action: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } },
        { entityId: { $regex: search, $options: 'i' } }
      ];
    }

    if (entity) filter.entity = entity;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      Log.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Log.countDocuments(filter)
    ]);

    return { logs, total, page: parseInt(page), limit: parseInt(limit) };
  }

  async getRecent(limit = 10) {
    return Log.find().sort({ timestamp: -1 }).limit(limit);
  }
}

module.exports = new LogService();
