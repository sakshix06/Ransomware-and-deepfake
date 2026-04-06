const dotenv = require('dotenv');
const result = dotenv.config({ path: './backend/.env' });
console.log("Dotenv result:", result.error ? "Error" : "Success");
console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
console.log("GEMINI_API_KEY length:", process.env.GEMINI_API_KEY?.length || 0);

const { chatWithAssistant } = require('./backend/services/ai-service.cjs');

async function test() {
    try {
        const resp = await chatWithAssistant("Hello", []);
        console.log("Response:", resp);
    } catch (e) {
        console.error("Test error:", e);
    }
}
test();
