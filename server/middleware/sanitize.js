// Strips keys that could be used for MongoDB operator injection ("$ne", "a.b") from body, query and params.
function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.')) continue;
      out[key] = clean(val);
    }
    return out;
  }
  return value;
}

module.exports = (req, res, next) => {
  if (req.body) req.body = clean(req.body);
  if (req.params) req.params = clean(req.params);
  if (req.query) {
    const cleaned = clean(req.query);
    for (const key of Object.keys(req.query)) delete req.query[key];
    Object.assign(req.query, cleaned);
  }
  next();
};
