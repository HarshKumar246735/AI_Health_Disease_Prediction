const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/token');

exports.protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new ApiError(401, 'Please sign in to continue.');
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, 'Your session has expired. Please sign in again.');
  }
  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, 'Your session has expired. Please sign in again.');
  req.user = user;
  next();
});

// Role check runs AFTER protect. The role always comes from the database, never from the token.
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return next(new ApiError(403, "You don't have access to this resource."));
  next();
};
