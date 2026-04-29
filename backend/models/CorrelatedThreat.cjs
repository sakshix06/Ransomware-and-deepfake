const mongoose = require('mongoose');

const correlatedThreatSchema = new mongoose.Schema({
  ransomwareScore: { type: Number },
  deepfakeScore: { type: Number },
  correlatedRisk: { type: Number },
  alertLevel: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CorrelatedThreat', correlatedThreatSchema);
