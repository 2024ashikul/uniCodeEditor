import { GoogleGenAI } from '@google/genai';
import {env} from '../config/environment'

export class AiRepository {
  private ai: GoogleGenAI;

  constructor() {
    
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }

  
  async generateContent(prompt: string): Promise<string | number> {
    const response = await this.ai.models.generateContent({
      model: "gemini-1.5-flash", // Using a consistent model
      contents: [{ parts: [{ text: prompt }] }]
    });
    if(response.text){
      return response.text;
    }else{
      return 'Failed to load AI generated content!';
    }
    
  }
}