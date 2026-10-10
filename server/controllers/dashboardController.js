const Assessment = require('../models/Assessment');
const asyncHandler = require('../utils/asyncHandler');
const { fillDays } = require('../utils/dates');

exports.stats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const since = new Date(Date.now() - 14 * 86400000);
  const [total, byRisk, byDisease, daily] = await Promise.all([
    Assessment.countDocuments({ userId }),
    Assessment.aggregate([{ $match: { userId } }, { $group: { _id: '$riskLevel', count: { $sum: 1 } } }]),
    Assessment.aggregate([
      { $match: { userId } },
      { $group: { _id: '$disease', name: { $first: '$diseaseName' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Assessment.aggregate([
      { $match: { userId, createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    ]),
  ]);
  const risk = { Low: 0, Moderate: 0, High: 0 };
  byRisk.forEach((r) => { risk[r._id] = r.count; });
  res.json({
    total,
    high: risk.High,
    moderate: risk.Moderate,
    low: risk.Low,
    riskDistribution: Object.entries(risk).map(([name, value]) => ({ name, value })),
    byDisease: byDisease.map((d) => ({ id: d._id, name: d.name, count: d.count })),
    history: fillDays(daily, 14),
  });
});

exports.recent = asyncHandler(async (req, res) => {
  const items = await Assessment.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(5).lean();
  res.json({ items });
});
