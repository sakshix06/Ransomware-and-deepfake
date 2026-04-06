const dotenv = require("dotenv");
dotenv.config({ path: "./backend/.env" });

async function debugGeminiRest20() {
  const API_KEY = process.env.GEMINI_API_KEY;
  // Using the exact name from the list: models/gemini-2.0-flash
  // But in REST URL, the 'models/' prefix is part of the path or stripped.
  // Standard format is models/model-name:generateContent
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  
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

debugGeminiRest20();
