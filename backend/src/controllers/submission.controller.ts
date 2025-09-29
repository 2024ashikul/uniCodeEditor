import { Request, Response } from 'express';
import { SubmissionService } from '../services/submission.service';

export class SubmissionController {
  private service: SubmissionService;

  constructor() {
    this.service = new SubmissionService();
  }

  createBulkSubmissions = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { assessmentId, answers } = req.body;
      await this.service.createQuizSubmission(assessmentId, (req as any).user.userId, answers);
      return res.status(201).json({ message: "Answers submitted successfully!" });
    } catch (err: any) { return res.status(500).json({ message: err.message }); }
  };

  submission = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { code, language, problemId } = req.body;
      await this.service.createCodeSubmission(problemId, (req as any).user.userId, code, language);
      return res.status(201).json({ message: 'Submitted successfully!' });
    } catch (err: any) { return res.status(500).json({ message: err.message }); }
  };
  
  uploadProject = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file was uploaded." });
      const { problemId, assessmentId } = req.body;
      const newSubmission = await this.service.createProjectSubmission(problemId, assessmentId, (req as any).user.userId, req.file);
      return res.status(200).json({ message: 'Project uploaded successfully!', newSubmission });
    } catch (err: any) { return res.status(500).json({ message: err.message }); }
  };

  resultsForAdminQuiz = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { assessmentId } = req.body;
      const results = await this.service.getAdminQuizResults(assessmentId);
      return res.status(200).json({ results });
    } catch (err: any) { return res.status(500).json({ message: err.message }); }
  };

  resultsForUserQuiz = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { assessmentId } = req.body;
      const result = await this.service.getUserQuizResults(assessmentId, (req as any).user.userId);
      return res.status(200).json(result);
    } catch (err: any) { return res.status(500).json({ message: err.message }); }
  };
  
  adminProjectSubmissions = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { assessmentId } = req.body;
      const submissions = await this.service.getAdminProjectSubmissions(assessmentId);
      return res.status(200).json(submissions);
    } catch (err: any) { return res.status(500).json({ message: err.message }); }
  };

  adminProjectResults = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { assessmentId } = req.body;
      const results = await this.service.getAdminProjectResults(assessmentId);
      return res.status(200).json({ results });
    } catch (err: any) { return res.status(500).json({ message: err.message }); }
  };
  
  ProjectSaveScore = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { assessmentId, userId, finalScore } = req.body;
      await this.service.saveProjectScore(assessmentId, userId, finalScore);
      return res.status(200).json({ message: 'Score Updated Successfully' });
    } catch (err: any) { return res.status(500).json({ message: err.message }); }
  };
  
  userResultProject = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { assessmentId } = req.body;
        const result = await this.service.getUserProjectResults(assessmentId, (req as any).user.userId);
        return res.status(200).json(result);
    } catch (err: any) { return res.status(500).json({ message: err.message }); }
  };
}