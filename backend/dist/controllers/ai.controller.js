"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const ai_service_1 = require("../services/ai.service");
class AiController {
    constructor() {
        this.generate = async (req, res) => {
            try {
                const { prompt } = req.body;
                const airesponse = await this.service.generateGeneric(prompt);
                return res.status(200).json(airesponse);
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to generate response', error: err.message });
            }
        };
        this.generateProblem = async (req, res) => {
            try {
                const { prompt } = req.body;
                const response = await this.service.generateProblem(prompt);
                return res.status(200).json(response);
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to generate problem', error: err.message });
            }
        };
        this.generateLesson = async (req, res) => {
            try {
                const { prompt } = req.body;
                const response = await this.service.generateLesson(prompt);
                return res.status(200).json(response);
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to generate lesson', error: err.message });
            }
        };
        this.generateCode = async (req, res) => {
            try {
                const { prompt } = req.body;
                const response = await this.service.generateCodeFeedback(prompt);
                return res.status(200).json(response);
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to generate code feedback', error: err.message });
            }
        };
        this.service = new ai_service_1.AiService();
    }
}
exports.AiController = AiController;
