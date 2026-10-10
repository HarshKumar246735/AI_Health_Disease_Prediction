const mongoose = require('mongoose');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const ml = require('../services/mlService');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getInsights } = require('../utils/insights');
const { escapeRegex, pageParams, cleanString } = require('../utils/validators');
const { fillDays, fillMonths } = require('../utils/dates');

const paged = (items, total, page, limit) => ({ items, page, limit, total, pages: Math.max(Math.ceil(total / limit), 1) });

exports.listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = pageParams(req.query);
  const filter = {};
  if (['USER', 'ADMIN'].includes(req.query.role)) filter.role = req.query.role;
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(cleanString(req.query.search)), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);
  const counts = await Assessment.aggregate([
    { $match: { userId: { $in: users.map((u) => u._id) } } },
    { $group: { _id: '$userId', count: { $sum: 1 } } },
  ]);
  const items = users.map((u) => ({
    id: u._id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt,
    assessmentCount: counts.find((c) => String(c._id) === String(u._id))?.count || 0,
  }));
  res.json(paged(items, total, page, limit));
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) throw new ApiError(404, "We couldn't find that user.");
  const [assessmentCount, recent] = await Promise.all([
    Assessment.countDocuments({ userId: user._id }),
    Assessment.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }, assessmentCount, recent });
});

exports.updateRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['USER', 'ADMIN'].includes(role)) throw new ApiError(400, 'Role must be USER or ADMIN.');
  if (String(req.user._id) === req.params.id) throw new ApiError(400, "You can't change your own role.");
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) throw new ApiError(404, "We couldn't find that user.");
  res.json({ user: user.toPublic() });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) throw new ApiError(400, "You can't delete your own account here.");
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "We couldn't find that user.");
  await Assessment.deleteMany({ userId: user._id });
  res.json({ message: 'User and their assessments deleted.' });
});

exports.listAssessments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = pageParams(req.query);
  const filter = {};
  if (req.query.disease) filter.disease = cleanString(req.query.disease);
  if (['Low', 'Moderate', 'High'].includes(req.query.risk)) filter.riskLevel = req.query.risk;
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(cleanString(req.query.search)), 'i');
    const userIds = await User.find({ $or: [{ name: rx }, { email: rx }] }).distinct('_id');
    filter.$or = [{ diseaseName: rx }, { userId: { $in: userIds } }];
  }
  const [items, total] = await Promise.all([
    Assessment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('userId', 'name email').lean(),
    Assessment.countDocuments(filter),
  ]);
  res.json(paged(items, total, page, limit));
});

exports.getAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findById(req.params.id).populate('userId', 'name email').lean();
  if (!assessment) throw new ApiError(404, "We couldn't find that assessment.");
  let features = null;
  try { features = (await ml.getSchema(assessment.disease))?.features || null; } catch { /* labels are optional */ }
  res.json({ assessment, features, insights: getInsights(assessment.disease) });
});

exports.deleteAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findByIdAndDelete(req.params.id);
  if (!assessment) throw new ApiError(404, "We couldn't find that assessment.");
  res.json({ message: 'Assessment deleted.' });
});

exports.stats = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const days30 = new Date(Date.now() - 30 * 86400000);
  const days14 = new Date(Date.now() - 14 * 86400000);
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCMonth(monthStart.getUTCMonth() - 5);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [totalUsers, totalAssessments, todayAssessments, highRisk, activeIds, growth, activity, popularity, risk] = await Promise.all([
    User.countDocuments(),
    Assessment.countDocuments(),
    Assessment.countDocuments({ createdAt: { $gte: startOfToday } }),
    Assessment.countDocuments({ riskLevel: 'High' }),
    Assessment.distinct('userId', { createdAt: { $gte: days30 } }),
    User.aggregate([
      { $match: { createdAt: { $gte: monthStart } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
    ]),
    Assessment.aggregate([
      { $match: { createdAt: { $gte: days14 } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    ]),
    Assessment.aggregate([
      { $group: { _id: '$disease', name: { $first: '$diseaseName' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Assessment.aggregate([{ $group: { _id: '$riskLevel', count: { $sum: 1 } } }]),
  ]);
  const riskMap = { Low: 0, Moderate: 0, High: 0 };
  risk.forEach((r) => { riskMap[r._id] = r.count; });
  res.json({
    totalUsers, totalAssessments, todayAssessments, highRisk, activeUsers: activeIds.length,
    userGrowth: fillMonths(growth, 6),
    activity: fillDays(activity, 14),
    diseasePopularity: popularity.map((p) => ({ id: p._id, name: p.name, count: p.count })),
    riskDistribution: Object.entries(riskMap).map(([name, value]) => ({ name, value })),
  });
});

exports.models = asyncHandler(async (req, res) => {
  const [models, healthy] = await Promise.all([ml.getModelInfo().catch(() => null), ml.health()]);
  res.json({ mlServiceHealthy: healthy, models: models || [] });
});

exports.systemInfo = asyncHandler(async (req, res) => {
  res.json({
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    mlService: (await ml.health()) ? 'reachable' : 'unreachable',
    node: process.version,
    environment: process.env.NODE_ENV || 'development',
  });
});
