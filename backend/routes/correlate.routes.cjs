const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { ransomwareScore, deepfakeScore } = req.body;
  
  // Compute correlation
  console.log(`Correlating Threats -> Ransomware: ${ransomwareScore}, Deepfake: ${deepfakeScore}`);
  
  const combinedRisk = Math.min((ransomwareScore * 0.6) + (deepfakeScore * 0.4), 100);
  
  res.json({
    success: true,
    correlatedScore: combinedRisk,
    alertLevel: combinedRisk > 80 ? "CRITICAL" : (combinedRisk > 50 ? "HIGH" : "LOW"),
    message: "Threat correlation completed."
  });
});

module.exports = router;
