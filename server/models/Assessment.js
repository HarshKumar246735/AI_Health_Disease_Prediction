const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    disease: { type: String, required: true, index: true },
    diseaseName: { type: String, required: true },
    inputData: { type: mongoose.Schema.Types.Mixed, required: true },
    prediction: { type: String, required: true },
    probability: { type: Number, required: true, min: 0, max: 100 },
    riskLevel: { type: String, enum: ['Low', 'Moderate', 'High'], required: true },
    explanation: { type: String, default: '' },
    factors: { type: [{ feature: String, label: String, direction: String, impact: Number, _id: false }], default: [] },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

assessmentSchema.index({ userId: 1, createdAt: -1 });
assessmentSchema.index({ riskLevel: 1 });
assessmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
