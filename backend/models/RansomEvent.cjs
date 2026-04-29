const mongoose = require('mongoose');

const ransomEventSchema = new mongoose.Schema({
  filesModified: { type: Number },
  entropySpike: { type: Boolean },
  threatLevel: { type: String },
  status: { type: String, default: 'detected' }
}, { timestamps: true });

module.exports = mongoose.model('RansomEvent', ransomEventSchema);
