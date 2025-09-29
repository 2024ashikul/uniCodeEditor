import { Request, Response } from 'express';
import { ProblemService } from '../services/problem.service';

export class ProblemController {
  private service: ProblemService;

  constructor() {
    this.service = new ProblemService();
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { assessmentId, form, type } = req.body;
      const newProblem = await this.service.createProblem(assessmentId, form, type);
      return res.status(201).json({ newProblem, message: 'New Problem created!' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
  };
  
  update = async (req: Request, res: Response): Promise<Response> => {
      try {
          const { editProblemId, form, type } = req.body;
          const problem = await this.service.updateProblem(editProblemId, form, type);
          return res.status(200).json({ problem, message: 'Problem updated' });
      } catch (err: any) {
          if (err.message === 'Problem not found') {
              return res.status(404).json({ message: err.message });
          }
          return res.status(500).json({ message: err.message });
      }
  };

  fetchAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { assessmentId } = req.body;
      const problems = await this.service.findAll(assessmentId);
      return res.status(200).json(problems);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };

  fetchOneProject = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { assessmentId } = req.body;
      const { problem, submission, submitted } = await this.service.getProjectWithSubmissionStatus(assessmentId, (req as any).user.userId);
      if (!problem) return res.status(404).json({ message: 'No problem found for this project' });
      return res.status(200).json({ problem, submission, submitted });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };
  
  fetchAllQuiz = async (req: Request, res: Response): Promise<Response> => {
      try {
          const { assessmentId } = req.body;
          const result = await this.service.getQuizWithSubmissionStatus(assessmentId, (req as any).user.userId);
          return res.status(200).json(result);
      } catch (err: any) {
          return res.status(500).json({ message: err.message });
      }
  };
  
  delete = async (req: Request, res: Response): Promise<Response> => {
      try {
          const { problemId } = req.body;
          await this.service.deleteProblem(problemId);
          return res.status(200).json({ message: 'Problem deleted' });
      } catch (err: any) {
          if (err.message.includes('not found')) {
              return res.status(404).json({ message: err.message });
          }
          return res.status(500).json({ message: err.message });
      }
  };
  
  fetchOne = async (req: Request, res: Response): Promise<Response> => {
      try {
          const { problemId } = req.body;
          const problem = await this.service.findOne(problemId);
          if (!problem) return res.status(404).json({ message: 'Problem not found!' });
          return res.status(200).json(problem);
      } catch (err: any) {
          return res.status(500).json({ message: err.message });
      }
  };
}