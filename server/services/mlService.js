const axios = require('axios');
const { mlServiceUrl, mlApiKey } = require('../config/env');
const ApiError = require('../utils/ApiError');

// Generous timeout: a free Render instance can take ~50s to wake from sleep.
const client = axios.create({
  baseURL: mlServiceUrl,
  timeout: 60000,
  headers: mlApiKey ? { 'x-api-key': mlApiKey } : {},
});

const unavailable = () =>
  new ApiError(503, "We couldn't complete the assessment right now. Please try again.", { code: 'ML_UNAVAILABLE' });

async function call(fn) {
  try {
    return (await fn()).data;
  } catch (err) {
    if (err.response?.status === 422) {
      throw new ApiError(400, 'Some inputs are invalid.', { errors: err.response.data.errors });
    }
    if (err.response?.status === 404) throw new ApiError(404, 'Unknown condition.');
    console.error('ML service error:', err.code || err.response?.status || err.message);
    throw unavailable();
  }
}

let schemaCache = { at: 0, data: null };

exports.getSchemas = async () => {
  if (schemaCache.data && Date.now() - schemaCache.at < 5 * 60 * 1000) return schemaCache.data;
  const data = await call(() => client.get('/schemas'));
  schemaCache = { at: Date.now(), data };
  return data;
};

exports.getSchema = async (id) => {
  const schemas = await exports.getSchemas();
  return schemas.find((s) => s.id === id) || null;
};

exports.predict = (disease, inputs) => call(() => client.post('/predict', { disease, inputs }));
exports.getModelInfo = () => call(() => client.get('/models/info'));
exports.health = async () => {
  try {
    await client.get('/health', { timeout: 8000 });
    return true;
  } catch {
    return false;
  }
};
