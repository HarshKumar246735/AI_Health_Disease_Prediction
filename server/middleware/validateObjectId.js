const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

module.exports = (param = 'id') => (req, res, next) =>
  mongoose.isValidObjectId(req.params[param]) ? next() : next(new ApiError(404, "We couldn't find what you were looking for."));
