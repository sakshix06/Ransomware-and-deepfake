const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });

async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        fs.writeFileSync('./available_models.json', JSON.stringify(data, null, 2));
        console.log("Successfully wrote available_models.json");
    } catch (err) {
        console.error("Error fetching models:", err);
    }
}

listModels();
