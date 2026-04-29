const express = require("express");
const router = express.Router();
const CorrelatedThreat = require("../models/CorrelatedThreat.cjs");

router.post("/", async (req, res) => {
  try {
    const { ransomwareScore, deepfakeScore } = req.body;
    
    // Compute correlation
    console.log(`Correlating Threats -> Ransomware: ${ransomwareScore}, Deepfake: ${deepfakeScore}`);
    
    const combinedRisk = Math.min((ransomwareScore * 0.6) + (deepfakeScore * 0.4), 100);
    const alertLevel = combinedRisk > 80 ? "CRITICAL" : (combinedRisk > 50 ? "HIGH" : "LOW");
    
    const newThreat = new CorrelatedThreat({
      ransomwareScore,
      deepfakeScore,
      correlatedRisk: combinedRisk,
      alertLevel
    });
    await newThreat.save();

    res.json({
      success: true,
      correlatedScore: combinedRisk,
      alertLevel: alertLevel,
      message: "Threat correlation completed and saved to MongoDB.",
      event_id: newThreat._id
    });
  } catch (err) {
    console.error("Error saving correlated threat:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
