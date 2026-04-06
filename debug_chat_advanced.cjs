const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "./backend/.env" });

async function debugChat() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY");
    return;
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log("Success:", response.text());
  } catch (err) {
    console.error("DEBUG ERROR LOG:");
    console.error("Status:", err.status);
    console.error("StatusText:", err.statusText);
    if (err.response) {
      console.error("Response Data:", await err.response.text());
    }
    console.error("Full Error:", JSON.stringify(err, null, 2));
  }
}

debugChat();
