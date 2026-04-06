const express = require("express");
const router = express.Router();
const aiService = require("../services/ai-service.cjs");

/* ===== STATE ===== */
let currentThreats = 0;
let totalSystems = 24;

/* ===== DASHBOARD ===== */
router.get("/live-status", (req, res) => {
  const coverage = Math.max(90 - currentThreats * 15, 50);
  res.json({
    threats: currentThreats,
    coverage,
    status: currentThreats > 0 ? "At Risk" : "Protected",
    systemsOnline: `${totalSystems}/${totalSystems}`,
    activity: {
      daily: Array.from({length: 6}, () => Math.floor(Math.random() * 20)),
      weekly: [65, 59, 80, 81, 56, 55],
      monthly: [280, 480, 400, 190, 860, 270],
    },
  });
});

/* ===== CONTROLS ===== */
router.post("/detect", (req, res) => {
  currentThreats++;
  console.log("⚠️ Ransomware activity detected!");
  res.json({ message: "Ransomware logged" });
});

router.post("/simulate-threat", (req, res) => {
  currentThreats++;
  res.json({ message: "Threat simulated" });
});

router.post("/clear-threats", (req, res) => {
  currentThreats = 0;
  res.json({ message: "Threats cleared" });
});

/* ===== AI ANALYSIS ===== */
router.post("/ai-analysis", async (req, res) => {
  const coverage = Math.max(90 - currentThreats * 15, 50);

  const aiResponse = await aiService.analyzeThreat({
    threats: currentThreats,
    coverage,
  });

  res.json({ success: true, aiResponse });
});

/* ===== CHATBOT API ===== */
router.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });
    
    const reply = await aiService.chatWithAssistant(message, history || []);
    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat response." });
  }
});

module.exports = router;
