/*
 * Development-only demo data. Run: npm run seed:demo   (remove again with: npm run seed:demo:clear)
 *
 * Demo users and assessments are flagged isDemo=true so they stay separable from real data.
 * Predictions are produced by the real ML service from RANDOM inputs, so the numbers are real model
 * outputs for unrealistic patients. They exist only to populate dashboards while developing.
 */
const connectDB = require('../config/db');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const ml = require('../services/mlService');

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function randomInputs(features) {
  const out = {};
  features.forEach((f) => {
    if (f.type === 'number') {
      const decimals = f.step && f.step < 1 ? String(f.step).split('.')[1]?.length || 2 : 0;
      out[f.key] = Number(rand(f.min, f.max).toFixed(decimals));
    } else if (f.type === 'boolean') out[f.key] = Math.random() < 0.4 ? 1 : 0;
    else out[f.key] = pick(f.options).value;
  });
  return out;
}

(async () => {
  await connectDB();
  if (process.argv.includes('--clear')) {
    await Assessment.deleteMany({ isDemo: true });
    const r = await User.deleteMany({ isDemo: true });
    console.log(`Removed demo data (${r.deletedCount} users).`);
    process.exit(0);
  }
  const schemas = await ml.getSchemas();
  const names = ['Demo Asha', 'Demo Ravi', 'Demo Meera', 'Demo Kabir'];
  let created = 0;
  for (let i = 0; i < names.length; i += 1) {
    const email = `demo.user${i + 1}@example.com`;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name: names[i], email, password: 'DemoPass123', isDemo: true });
      user.createdAt = new Date(Date.now() - rand(5, 150) * 86400000);
      await User.collection.updateOne({ _id: user._id }, { $set: { createdAt: user.createdAt } });
    }
    for (let j = 0; j < 8; j += 1) {
      const schema = pick(schemas);
      const result = await ml.predict(schema.id, randomInputs(schema.features));
      const doc = await Assessment.create({
        userId: user._id, disease: schema.id, diseaseName: schema.name, inputData: result.inputs,
        prediction: result.prediction, probability: result.probability, riskLevel: result.riskLevel,
        explanation: result.explanation, factors: result.factors, isDemo: true,
      });
      await Assessment.collection.updateOne({ _id: doc._id }, { $set: { createdAt: new Date(Date.now() - rand(0, 40) * 86400000) } });
      created += 1;
    }
  }
  console.log(`Demo data ready: ${created} assessments. Demo login: demo.user1@example.com / DemoPass123`);
  process.exit(0);
})().catch((err) => { console.error(err.message); process.exit(1); });
