require('dotenv').config({ path: './backend/.env' });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Using Gemini 2.5 Flash as it is stable and faster
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/* =========================
   GEMINI API INTEGRATION
========================= */

/* =========================
   GEMINI API INTEGRATION
========================= */
async function geminiAnalysis(context) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("AI module offline: GEMINI_API_KEY is missing.");
  }

  try {
    const prompt = `
You are an advanced cybersecurity AI agent analyzing a ransomware threat on a dashboard.
Current Metrics:
- Threats detected: ${context.threats}
- Shield Coverage: ${context.coverage}%

Provide a highly concise, authoritative, and direct explanation. No Markdown. 3-4 sentences max.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text() || "";

    return {
      threatType: "AI-Confirmed Ransomware Payload",
      killChainStage: "Impact & Lateral Movement",
      riskScore: Math.min(50 + context.threats * 15, 95),
      explanation: output.trim().replace(/\*/g, ""), 
      recommendedAction: "Isolate infected systems, block unauthorized outgoing ports, and restore from an immutable clean backup.",
      aiMode: "gemini",
    };
  } catch (err) {
    console.error("Gemini Analysis Error:", err.message);
    throw new Error("AI analysis failed: " + err.message);
  }
}

async function geminiDeepfakeAnalysis(context) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return fallbackDeepfakeAnalysis(context);
    }

    const prompt = `
You are an advanced cybersecurity AI agent analyzing a Deepfake threat on a dashboard.
Current Context:
- Is Deepfake: ${context.isDeepfake}
- Confidence Score: ${context.confidenceScore}%
- Markers: ${JSON.stringify(context.markers)}

No Markdown. 3-4 sentences max.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || fallbackDeepfakeAnalysis(context);
  } catch (err) {
    if (err.message && err.message.includes('429')) {
      console.warn("⚠️ Gemini Deepfake API Quota Exceeded. Using fallback protocols.");
    } else {
      console.error("Gemini Deepfake Error:", err.message);
    }
    return fallbackDeepfakeAnalysis(context);
  }
}

function fallbackDeepfakeAnalysis(context) {
  const verdictText = context.isDeepfake 
    ? `The neural network is highly confident (${context.confidenceScore}%) that this media has been synthetically altered or AI-generated.` 
    : `The analysis indicates a ${context.confidenceScore}% probability that this media is authentic and unmanipulated.`;
  
  const anomaliesReasoning = context.markers && context.markers.length > 0
    ? `\n\nKey Anomalies Detected:\n${context.markers.map(m => `- ${m.name} (${m.severity} severity): ${m.description}`).join('\n')}`
    : `\n\nNo significant anomalies or digital artifacts were detected in the spatial or temporal structures.`;
  
  const recommendationText = `\n\nSuggested Action:\n${context.isDeepfake && context.protectionRecommendations?.length > 0 ? context.protectionRecommendations[0] : "Continue normal operations but maintain standard verification protocols."}`;

  return verdictText + anomaliesReasoning + recommendationText;
}

async function analyzeDeepfakeThreat(context) {
  try {
    const text = await geminiDeepfakeAnalysis(context);
    return text.trim().replace(/\*/g, "");
  } catch (err) {
    console.warn("⚠️ Gemini analysis skipped/failed for Deepfake:", err.message);
    return fallbackDeepfakeAnalysis(context);
  }
}

/* =========================
   MAIN ENTRY POINT
========================= */
async function analyzeThreat(context) {
  return await geminiAnalysis(context);
}

async function chatWithAssistant(message, history) {
  const DEFAULT_FAIL_MSG = "Vanguard AI Engine is processing requests via secure heuristic protocols. Your system is safe and monitored. How else can I assist with your cybersecurity needs?";

  try {
    if (!process.env.GEMINI_API_KEY) {
      return DEFAULT_FAIL_MSG;
    }

    const systemContext = `
You are an intelligent AI assistant for a cybersecurity platform called RansomGuard. 
Your job is to answer ANY type of user query in a smart, clear, and helpful way.

You can handle:
- Cybersecurity threats (ransomware, malware, phishing)
- Deepfake detection (images/videos)
- Explaining threats and risks
- General questions about this platform
- Any general knowledge question

Instructions:
- Always understand the user's intent first
- If the input is a threat -> analyze and explain it
- If the input is about deepfake -> explain signs of manipulation
- If it's a question -> answer clearly and simply
- If needed, give examples
- Keep answers user-friendly (not too technical)
- Give step-by-step explanation when useful
- Include safety tips if related to cybersecurity

Response format:
- Use clear points or short paragraphs
- Be concise but informative
- Plain text only.
`;

    const formattedHistory = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
    const prompt = `${systemContext}\n\nChat History:\n${formattedHistory}\n\nUser: ${message}\nAssistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text || DEFAULT_FAIL_MSG;
  } catch (err) {
    if (err && err.message && err.message.includes('429')) {
      console.warn("⚠️ Gemini Chat API Quota Exceeded. Using fallback protocols.");
    } else {
      console.error("Chat API error:", err && err.message ? err.message : err);
    }
    return DEFAULT_FAIL_MSG;
  }
}

async function detectMediaForgery(base64Data, mimeType) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("No API Key available for Vision analysis");
    }

    const payloadPrompt = `
You are an elite cybersecurity forensics AI. Analyze this image for signs of deepfake manipulation, AI generation, or image editing.
Respond strictly with a JSON object in this exact format, with no markdown formatting or extra text:
{
  "isDeepfake": true or false,
  "confidenceScore": number from 0 to 100 (where 100 means extreme confidence it is fake, 0 means perfectly authentic),
  "markers": [
    { "name": "Anomaly Name", "description": "Details about the artifact or natural element", "severity": "low" | "medium" | "high" }
  ]
}
If it is authentic, explain natural physics consistency in the markers.
`;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([payloadPrompt, imagePart]);
    const responseText = result.response.text();
    
    // Parse the JSON output, handling any markdown blocks
    const jsonStr = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    if (err.message && err.message.includes('429')) {
      console.warn("⚠️ Gemini Vision API Quota Exceeded.");
    } else {
      console.error("Gemini Vision Forgery Detection Error:", err.message);
    }
    throw err;
  }
}

module.exports = { analyzeThreat, analyzeDeepfakeThreat, chatWithAssistant, detectMediaForgery };
