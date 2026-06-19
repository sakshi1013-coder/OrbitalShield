const collisionService = require('../services/collisionService');
const { formatResponse } = require('../utils/helpers');

const detect = async (req, res, next) => {
  try {
    const results = await collisionService.detectCollisions();
    res.json(formatResponse(results, `Collision detection complete. Found ${results.length} potential conflicts`));
  } catch (error) {
    next(error);
  }
};

module.exports = { detect };
