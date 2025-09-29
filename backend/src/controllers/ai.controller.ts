import { Request, Response } from 'express';
import { AiService } from '../services/ai.service';

export class AiController {
  private service: AiService;

  constructor() {
    this.service = new AiService();
  }

  generate = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { prompt } = req.body;
      const airesponse = await this.service.generateGeneric(prompt);
      return res.status(200).json(airesponse);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to generate response', error: err.message });
    }
  };

  generateProblem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { prompt } = req.body;
      const response = await this.service.generateProblem(prompt);
      return res.status(200).json(response);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to generate problem', error: err.message });
    }
  };

  generateLesson = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { prompt } = req.body;
      const response = await this.service.generateLesson(prompt);
      return res.status(200).json(response);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to generate lesson', error: err.message });
    }
  };

  generateCode = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { prompt } = req.body;
      const response = await this.service.generateCodeFeedback(prompt);
      return res.status(200).json(response);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to generate code feedback', error: err.message });
    }
  };
}