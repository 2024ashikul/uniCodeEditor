import { Request, Response } from 'express';
import { AuthorizationService } from '../services/authorization.service';

export class AuthorizationController {
  private service: AuthorizationService;

  constructor() {
    this.service = new AuthorizationService();
  }

 
  checkAccess = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId, roomId, assessmentId, problemId } = req.body;

      if (!userId) {
        return res.status(401).json({ allowed: false, message: 'User ID is required for authorization.' });
      }

      let response;

      if (roomId) {
        response = await this.service.checkRoomAccess(userId, roomId);
      } else if (assessmentId) {
        response = await this.service.checkAssessmentAccess(userId, assessmentId);
      } else if (problemId) {
        response = await this.service.checkProblemAccess(userId, problemId);
      } else {
        return res.status(400).json({ allowed: false, message: 'A resource ID (roomId, assessmentId, or problemId) is required.' });
      }

      const status = response.allowed ? 200 : 403; 
      return res.status(status).json(response);

    } catch (err: any) {
      return res.status(500).json({ allowed: false, message: err.message || 'An internal server error occurred.' });
    }
  };
}