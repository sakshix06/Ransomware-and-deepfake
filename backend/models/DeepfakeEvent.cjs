const mongoose = require('mongoose');

const deepfakeEventSchema = new mongoose.Schema({
  mediaType: { type: String },
  confidenceScore: { type: Number },
  isDeepfake: { type: Boolean },
  markers: { type: Array },
  analysisExplanation: { type: String },
  metadata: { type: Object },
  status: { type: String, default: 'logged' }
}, { timestamps: true });

module.exports = mongoose.model('DeepfakeEvent', deepfakeEventSchema);
