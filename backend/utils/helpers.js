const generateId = (prefix) => {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${num}`;
};

const generateSatelliteId = () => generateId('SAT');
const generateMissionId = () => generateId('MSN');
const generateDebrisId = () => generateId('DEB');
const generateAlertId = () => generateId('ALT');

const formatResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

const formatPaginatedResponse = (data, total, page, limit) => ({
  success: true,
  data,
  pagination: {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(total / limit)
  }
});

module.exports = {
  generateId,
  generateSatelliteId,
  generateMissionId,
  generateDebrisId,
  generateAlertId,
  formatResponse,
  formatPaginatedResponse
};
