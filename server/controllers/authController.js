const User = require('../models/User');
const Assessment = require('../models/Assessment');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/token');
const { cleanString, validateName, validateEmail, validatePassword } = require('../utils/validators');

const sendAuth = (res, status, user) => res.status(status).json({ token: signToken(user._id), user: user.toPublic() });

exports.register = asyncHandler(async (req, res) => {
  const name = cleanString(req.body.name);
  const email = cleanString(req.body.email).toLowerCase();
  const { password } = req.body;
  const errors = { name: validateName(name), email: validateEmail(email), password: validatePassword(password) };
  if (Object.values(errors).some(Boolean)) throw new ApiError(400, Object.values(errors).find(Boolean), { errors });
  if (await User.exists({ email })) throw new ApiError(409, 'An account with this email already exists.');
  const user = await User.create({ name, email, password, role: 'USER' }); // role is never taken from the request
  sendAuth(res, 201, user);
});

exports.login = asyncHandler(async (req, res) => {
  const email = cleanString(req.body.email).toLowerCase();
  const { password } = req.body;
  if (!email || typeof password !== 'string') throw new ApiError(400, 'Enter your email and password.');
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Incorrect email or password.');
  sendAuth(res, 200, user);
});

exports.me = asyncHandler(async (req, res) => {
  const totalAssessments = await Assessment.countDocuments({ userId: req.user._id });
  res.json({ user: req.user.toPublic(), totalAssessments });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const name = cleanString(req.body.name);
  const email = cleanString(req.body.email).toLowerCase();
  const errors = { name: validateName(name), email: validateEmail(email) };
  if (Object.values(errors).some(Boolean)) throw new ApiError(400, Object.values(errors).find(Boolean), { errors });
  if (email !== req.user.email && (await User.exists({ email }))) throw new ApiError(409, 'That email is already in use.');
  req.user.name = name;
  req.user.email = email;
  await req.user.save();
  res.json({ user: req.user.toPublic() });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (typeof currentPassword !== 'string' || !(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, 'Your current password is incorrect.', { errors: { currentPassword: 'Your current password is incorrect.' } });
  }
  const problem = validatePassword(newPassword);
  if (problem) throw new ApiError(400, problem, { errors: { newPassword: problem } });
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated.' });
});
