const ApiError = require('../utils/ApiError');

exports.notFound = (req, res, next) => next(new ApiError(404, 'Route not found.'));

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, ...(err.errors && { errors: err.errors }), ...(err.code && { code: err.code }) });
  }
  if (err.name === 'ValidationError') return res.status(400).json({ message: 'Some details are invalid.' });
  if (err.code === 11000) return res.status(409).json({ message: 'That email is already registered.' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid request body.' });
  console.error(err); // details stay in server logs, never in the response
  return res.status(500).json({ message: 'Something went wrong on our side. Please try again.' });
};
