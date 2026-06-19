const Mission = require('../models/Mission');
const Log = require('../models/Log');
const { generateMissionId } = require('../utils/helpers');

class MissionService {
  async getAll(query = {}) {
    const {
      search = '',
      status = '',
      missionType = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { missionId: { $regex: search, $options: 'i' } },
        { missionCode: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) filter.status = status;
    if (missionType) filter.missionType = missionType;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [missions, total] = await Promise.all([
      Mission.find(filter).populate('satellite', 'name satelliteId').sort(sort).skip(skip).limit(parseInt(limit)),
      Mission.countDocuments(filter)
    ]);

    return { missions, total, page: parseInt(page), limit: parseInt(limit) };
  }

  async getById(id) {
    const mission = await Mission.findById(id).populate('satellite', 'name satelliteId orbitType');
    if (!mission) {
      const error = new Error('Mission not found');
      error.statusCode = 404;
      throw error;
    }
    return mission;
  }

  async create(data) {
    data.missionId = generateMissionId();
    const mission = await Mission.create(data);
    const populated = await Mission.findById(mission._id).populate('satellite', 'name satelliteId');

    await Log.create({
      action: 'Mission Created',
      entity: 'Mission',
      entityId: mission.missionId,
      details: `Mission "${mission.name}" (${mission.missionId}) was created`
    });

    return populated;
  }

  async update(id, data) {
    const mission = await Mission.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).populate('satellite', 'name satelliteId');

    if (!mission) {
      const error = new Error('Mission not found');
      error.statusCode = 404;
      throw error;
    }

    await Log.create({
      action: 'Mission Updated',
      entity: 'Mission',
      entityId: mission.missionId,
      details: `Mission "${mission.name}" (${mission.missionId}) was updated`
    });

    return mission;
  }

  async delete(id) {
    const mission = await Mission.findByIdAndDelete(id);

    if (!mission) {
      const error = new Error('Mission not found');
      error.statusCode = 404;
      throw error;
    }

    await Log.create({
      action: 'Mission Deleted',
      entity: 'Mission',
      entityId: mission.missionId,
      details: `Mission "${mission.name}" (${mission.missionId}) was deleted`
    });

    return mission;
  }

  async getActiveCount() {
    return Mission.countDocuments({ status: 'Active' });
  }

  async getStatusDistribution() {
    return Mission.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  }

  async getRecent(limit = 5) {
    return Mission.find()
      .populate('satellite', 'name satelliteId')
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

module.exports = new MissionService();
