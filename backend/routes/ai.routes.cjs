const express = require("express");
const router = express.Router();
const aiService = require("../services/ai-service.cjs");

router.post("/analyze", async (req, res) => {
  try {
    const aiResponse = await aiService.analyzeThreat(req.body);
    res.json({ success: true, aiResponse });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "AI analysis failed",
    });
  }
});

module.exports = router;
