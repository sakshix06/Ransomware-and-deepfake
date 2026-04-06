require("dotenv").config();
const OpenAI = require("openai");

console.log("KEY LOADED:", !!process.env.OPENAI_API_KEY);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
  try {
    const res = await client.responses.create({
      model: "gpt-4.1-mini",
      input: "Reply with only the word OK",
    });

    console.log("SUCCESS:", res.output_text);
  } catch (err) {
    console.error("FAIL:", err.status, err.message);
  }
})();
