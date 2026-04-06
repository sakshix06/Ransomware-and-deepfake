const express = require("express");
const router = express.Router();
const aiService = require("../services/ai-service.cjs");

// Mock state counter for dashboard simulation (optional to connect to Dashboard directly)
let deepfakeDetections = 0;

router.post("/detect", (req, res) => {
  const { mediaType, probability, confidence } = req.body;
  
  // Log the event
  console.log(`Deepfake Detected: [${mediaType}] - Confidence: ${confidence} (${probability}%)`);
  deepfakeDetections++;

  // Add the threat response for deepfakes
  res.json({
    status: "success",
    message: "Deepfake threat metadata logged successfully",
    event_id: `evt_${Date.now()}`
  });
});

router.post("/ai-analysis", async (req, res) => {
  const { isDeepfake, confidenceScore, markers, protectionRecommendations, metadata } = req.body;
  const explanation = await aiService.analyzeDeepfakeThreat({
    isDeepfake,
    confidenceScore,
    markers,
    protectionRecommendations,
    metadata
  });
  
  res.json({ success: true, explanation });
});

router.post("/scan-media", async (req, res) => {
  try {
    const { mediaBase64, mediaType } = req.body;
    if (!mediaBase64) {
      return res.status(400).json({ success: false, error: "No media data provided" });
    }
    
    // Attempt standard detection if AI key available
    const detectionResult = await aiService.detectMediaForgery(mediaBase64, mediaType);
    
    res.json({ success: true, result: detectionResult });
  } catch (err) {
    console.error("/scan-media error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
