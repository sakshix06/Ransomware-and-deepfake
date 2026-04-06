const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "./backend/.env" });

async function listModels() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY");
    return;
  }
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.models) {
      data.models.forEach(m => {
        console.log(`Name: ${m.name}, Display: ${m.displayName}`);
      });
    } else {
      console.log("No models found or error:", data);
    }
  } catch (err) {
    console.error(err);
  }
}

listModels();
