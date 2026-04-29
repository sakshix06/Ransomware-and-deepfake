const express = require("express");
const router = express.Router();
const aiService = require("../services/ai-service.cjs");
const DeepfakeEvent = require("../models/DeepfakeEvent.cjs");

// Mock state counter for dashboard simulation (optional to connect to Dashboard directly)
let deepfakeDetections = 0;

router.post("/detect", async (req, res) => {
  try {
    const data = req.body;
    
    const newEvent = new DeepfakeEvent(data);
    await newEvent.save();

    console.log(`Deepfake Detected & Saved: [${data.mediaType || 'unknown'}] - Confidence: ${data.confidenceScore || data.probability || 'N/A'}`);
    deepfakeDetections++;

    res.json({
      status: "success",
      message: "Deepfake threat metadata logged successfully to MongoDB",
      event_id: newEvent._id
    });
  } catch (err) {
    console.error("Error saving deepfake event:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
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
