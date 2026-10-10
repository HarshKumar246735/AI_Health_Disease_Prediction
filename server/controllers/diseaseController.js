const ml = require('../services/mlService');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getInsights } = require('../utils/insights');

exports.list = asyncHandler(async (req, res) => {
  const schemas = await ml.getSchemas();
  res.json({
    diseases: schemas.map(({ id, name, icon, description, featureCount, dataset }) => ({ id, name, icon, description, featureCount, dataset })),
  });
});

exports.getOne = asyncHandler(async (req, res) => {
  const schema = await ml.getSchema(req.params.id);
  if (!schema) throw new ApiError(404, "We couldn't find that condition.");
  res.json({ disease: schema, insights: getInsights(schema.id) });
});
