require('dotenv').config({ path: './backend/.env' });
const { chatWithAssistant } = require('./backend/services/ai-service.cjs');

async function testAssistant() {
    console.log("--- Testing RansomGuard AI Assistant ---");
    
    // Test Case 1: Cybersecurity Threat
    console.log("\n[Test 1] User: How do I protect against Ransomware?");
    const resp1 = await chatWithAssistant("How do I protect against Ransomware?", []);
    console.log("Assistant:", resp1);

    // Test Case 2: Deepfake
    console.log("\n[Test 2] User: What are signs of a deepfake video?");
    const resp2 = await chatWithAssistant("What are signs of a deepfake video?", []);
    console.log("Assistant:", resp2);

    // Test Case 3: General Knowledge
    console.log("\n[Test 3] User: What is the capital of France?");
    const resp3 = await chatWithAssistant("What is the capital of France?", []);
    console.log("Assistant:", resp3);
}

testAssistant().catch(console.error);
