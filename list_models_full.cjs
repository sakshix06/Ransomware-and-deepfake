const dotenv = require("dotenv");
dotenv.config({ path: "./backend/.env" });

async function listModelsFull() {
  const API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    const fs = require("fs");
    fs.writeFileSync("models_full.json", JSON.stringify(data, null, 2));
    console.log("Wrote full model list to models_full.json");
  } catch (err) {
    console.error(err);
  }
}

listModelsFull();
