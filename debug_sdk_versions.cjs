const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "./backend/.env" });

async function debugSdkV1() {
  const API_KEY = process.env.GEMINI_API_KEY;
  // Trying to specify apiVersion 'v1' to avoid v1beta errors if possible
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  try {
    console.log("Testing with apiVersion: v1");
    const modelV1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });
    const resultV1 = await modelV1.generateContent("Hello");
    console.log("V1 Response:", (await resultV1.response).text());
  } catch (err) {
    console.error("V1 Error:", err.message);
  }

  try {
    console.log("\nTesting with default (v1beta)");
    const modelBeta = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const resultBeta = await modelBeta.generateContent("Hello");
    console.log("V1beta Response:", (await resultBeta.response).text());
  } catch (err) {
    console.error("V1beta Error:", err.message);
  }
}

debugSdkV1();
