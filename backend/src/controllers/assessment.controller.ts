import { Request, Response } from 'express';
import { AssessmentService } from '../services/assessment.service';
import { AssessmentRepository } from '../repositories/assessment.repository';

export class AssessmentController {
  private service: AssessmentService;

  constructor() {
    //  DI container should provide the repository in production
    const repository = new AssessmentRepository();
    this.service = new AssessmentService(repository);
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { roomId, userId, form, assessmentId } = req.body;
      const assessment = await this.service.createOrUpdate({
        roomId, userId, ...form, assessmentId
      });
      const message = assessmentId ? 'Assessment updated successfully' : 'Assessment created successfully';
      return res.status(201).json({ assessment, message });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };

  fetchOne = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { assessmentId } = req.body;
      const assessment = await this.service.findOne(assessmentId);
      if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
      return res.status(200).json(assessment);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };

  fetchAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { roomId } = req.body;
      const assessments = await this.service.findAll(roomId);
      return res.status(200).json(assessments);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };
  
  fetchAllUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { roomId } = req.body;
        const assessments = await this.service.findAllAssignedForUser(roomId);
        return res.status(200).json(assessments);
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
  };

  changeSchedule = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { assessmentId, userId, form } = req.body;
        const assessment = await this.service.scheduleAndNotify(assessmentId, userId, form);
        return res.status(200).json(assessment);
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
  };

  publishResult = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { assessmentId } = req.body;
      await this.service.publishResults(assessmentId);
      return res.status(200).json({ message: 'Result Published successfully' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };
  
  changeWhoCanSeeResults = async (req: Request, res: Response): Promise<Response> => {
      try {
          const { assessmentId } = req.body;
          await this.service.toggleEveryoneSeesResults(assessmentId);
          return res.status(200).json({ message: 'Visibility updated successfully' });
      } catch (err: any) {
          return res.status(500).json({ message: err.message });
      }
  };
}