// lib/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

function initializeGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GOOGLE_API_KEY not found in environment variables.");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    return model;
}

module.exports = { initializeGemini };