const dotenv = require("dotenv");
dotenv.config({ path: "./backend/.env" });

async function debugGeminiRestV1() {
  const API_KEY = process.env.GEMINI_API_KEY;
  // Gemini URL format: https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=...
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  console.log("Using URL:", url.replace(API_KEY, "HIDDEN"));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
      })
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response Data:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

debugGeminiRestV1();
