const Alert = require('../models/Alert');
const Log = require('../models/Log');

class AlertService {
  async getAll(query = {}) {
    const {
      status = '',
      riskLevel = '',
      sortBy = 'timestamp',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = query;

    const filter = {};
    if (status) filter.status = status;
    if (riskLevel) filter.riskLevel = riskLevel;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [alerts, total] = await Promise.all([
      Alert.find(filter)
        .populate('satellite', 'name satelliteId')
        .populate('debris', 'objectName debrisId')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Alert.countDocuments(filter)
    ]);

    return { alerts, total, page: parseInt(page), limit: parseInt(limit) };
  }

  async resolve(id, operatorNotes = '') {
    const alert = await Alert.findByIdAndUpdate(
      id,
      { status: 'Resolved', operatorNotes },
      { new: true }
    )
      .populate('satellite', 'name satelliteId')
      .populate('debris', 'objectName debrisId');

    if (!alert) {
      const error = new Error('Alert not found');
      error.statusCode = 404;
      throw error;
    }

    await Log.create({
      action: 'Alert Resolved',
      entity: 'Alert',
      entityId: alert.alertId,
      details: `Alert "${alert.alertId}" was resolved. Notes: ${operatorNotes || 'None'}`
    });

    return alert;
  }

  async delete(id) {
    const alert = await Alert.findByIdAndDelete(id);

    if (!alert) {
      const error = new Error('Alert not found');
      error.statusCode = 404;
      throw error;
    }

    await Log.create({
      action: 'Alert Deleted',
      entity: 'Alert',
      entityId: alert.alertId,
      details: `Alert "${alert.alertId}" was deleted`
    });

    return alert;
  }

  async getActiveCount() {
    return Alert.countDocuments({ status: 'Active' });
  }

  async getRecent(limit = 5) {
    return Alert.find()
      .populate('satellite', 'name satelliteId')
      .populate('debris', 'objectName debrisId')
      .sort({ timestamp: -1 })
      .limit(limit);
  }
}

module.exports = new AlertService();
