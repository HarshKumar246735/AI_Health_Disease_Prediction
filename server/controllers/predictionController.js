const Assessment = require('../models/Assessment');
const ml = require('../services/mlService');
const { buildReport } = require('../services/pdfService');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getInsights } = require('../utils/insights');
const { escapeRegex, pageParams, cleanString } = require('../utils/validators');

exports.create = asyncHandler(async (req, res) => {
  const disease = cleanString(req.body.disease);
  const { inputData } = req.body;
  if (!disease) throw new ApiError(400, 'Choose a condition first.');
  if (!inputData || typeof inputData !== 'object' || Array.isArray(inputData)) throw new ApiError(400, 'Enter the assessment details.');

  const schema = await ml.getSchema(disease);
  if (!schema) throw new ApiError(404, "We couldn't find that condition.");

  const result = await ml.predict(disease, inputData); // the ML service validates every field again
  const assessment = await Assessment.create({
    userId: req.user._id,
    disease,
    diseaseName: schema.name,
    inputData: result.inputs,
    prediction: result.prediction,
    probability: result.probability,
    riskLevel: result.riskLevel,
    explanation: result.explanation,
    factors: result.factors,
  });
  res.status(201).json({ assessment });
});

exports.list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = pageParams(req.query);
  const filter = { userId: req.user._id };
  if (req.query.disease) filter.disease = cleanString(req.query.disease);
  if (['Low', 'Moderate', 'High'].includes(req.query.risk)) filter.riskLevel = req.query.risk;
  if (req.query.search) filter.diseaseName = new RegExp(escapeRegex(cleanString(req.query.search)), 'i');

  const sorts = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, probability: { probability: -1 } };
  const sort = sorts[req.query.sort] || sorts.newest;

  const [items, total] = await Promise.all([
    Assessment.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Assessment.countDocuments(filter),
  ]);
  res.json({ items, page, limit, total, pages: Math.max(Math.ceil(total / limit), 1) });
});

const findOwned = async (req) => {
  const assessment = await Assessment.findOne({ _id: req.params.id, userId: req.user._id });
  if (!assessment) throw new ApiError(404, "We couldn't find that assessment.");
  return assessment;
};

exports.getOne = asyncHandler(async (req, res) => {
  const assessment = await findOwned(req);
  let features = null;
  try {
    features = (await ml.getSchema(assessment.disease))?.features || null;
  } catch {
    // Labels are a nicety; the record is still readable without the ML service.
  }
  res.json({ assessment, features, insights: getInsights(assessment.disease) });
});

exports.remove = asyncHandler(async (req, res) => {
  const assessment = await findOwned(req);
  await assessment.deleteOne();
  res.json({ message: 'Assessment deleted.' });
});

exports.report = asyncHandler(async (req, res) => {
  const assessment = await findOwned(req);
  let features = [];
  try {
    features = (await ml.getSchema(assessment.disease))?.features || [];
  } catch {
    features = [];
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="HealthPredict-${assessment.disease}-${assessment._id}.pdf"`);
  buildReport({ assessment, user: req.user, features, insights: getInsights(assessment.disease) }).pipe(res);
});
