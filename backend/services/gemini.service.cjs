const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function generate(context) {
  const apiKey = process.env.GEMINI_API_KEY;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
    apiKey;

  const prompt = `
You are a cybersecurity SOC analyst.

Threats detected: ${context.threats}
Protection coverage: ${context.coverage}%

Explain clearly:
1. Why this is ransomware
2. MITRE Kill Chain stage
3. Risk score (0–100)
4. Recommended mitigation steps
`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

module.exports = { generate };
