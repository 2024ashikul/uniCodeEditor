"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRepository = void 0;
const genai_1 = require("@google/genai");
class AiRepository {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set in environment variables.");
        }
        this.ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    async generateContent(prompt) {
        const response = await this.ai.models.generateContent({
            model: "gemini-1.5-flash", // Using a consistent model
            contents: [{ parts: [{ text: prompt }] }]
        });
        return response.text;
    }
}
exports.AiRepository = AiRepository;
