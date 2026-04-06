
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "./backend/.env" });

async function listModels() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY");
    return;
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There isn't a direct listModels in the JS SDK that is as easy as Python,
    // but we can try to initialize some models and see.
    // Actually, let's just try gemini-1.5-flash-latest as a fix.
    console.log("Attempting to list models is not straightforward in JS SDK without extra calls.");
    console.log("Trying to use gemini-1.5-flash-latest instead...");
  } catch (err) {
    console.error(err);
  }
}

listModels();
