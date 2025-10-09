"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const ai_repository_1 = require("../repositories/ai.repository");
class AiService {
    constructor() {
        this.aiRepo = new ai_repository_1.AiRepository();
    }
    async generateGeneric(prompt) {
        return this.aiRepo.generateContent(prompt);
    }
    async generateProblem(prompt) {
        const finalPrompt = `
      Listen and Follow the instructions carefully:
      1. This is a prompt for creating a computer science problem.
      2. Do not tell anything extra; be direct and to the point.
      3. The output will be used in a markdown component, so generate raw markdown. Use all necessary formatting.
      4. Make the problem nice and precise—not too short, not too long.
      5. Provide a clear example of the expected input and output if applicable.
      6. Do not wrap the final markdown in triple backticks.
      
      Now, generate the markdown for the following topic: ${prompt}
    `;
        return this.aiRepo.generateContent(finalPrompt);
    }
    async generateLesson(prompt) {
        const finalPrompt = `
      Listen and Follow the instructions carefully:
      1. This is a prompt for creating a computer science lesson on the given topic.
      2. The output will be used in a markdown component, so generate raw markdown. Use all necessary formatting and examples.
      3. Make the lesson nice and precise—not too short, not too long.
      4. Do not wrap the final markdown in triple backticks.

      Now, generate the markdown for the following lesson topic: ${prompt}
    `;
        return this.aiRepo.generateContent(finalPrompt);
    }
    async generateCodeFeedback(prompt) {
        const finalPrompt = `
      Listen and Follow the instructions carefully:
      1. This is a prompt for finding errors in a piece of code.
      2. Your task is to identify errors and suggest corrections.
      3. You must paste the original code exactly as given.
      4. Add your error suggestions as comments on the right side of the lines where they are needed.
      5. All edits and suggestions must be within comments.

      Now, provide feedback for the following code:
      ${prompt}
    `;
        return this.aiRepo.generateContent(finalPrompt);
    }
}
exports.AiService = AiService;
