import { Request, Response } from 'express';
import { MeetingService } from '../services/meeting.service';

export class MeetingController {
  private service: MeetingService;

  constructor() {
    this.service = new MeetingService();
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { roomId, userId, type } = req.body;
      await this.service.createMeeting(roomId, userId, type);
      return res.status(201).json({ message: 'New meeting created' });
    } catch (err: any) {
      if (err.message.includes('already active')) {
        return res.status(409).json({ message: err.message }); // 409 Conflict
      }
      return res.status(500).json({ message: err.message || 'Internal server error!' });
    }
  };

  leave = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { roomId, type } = req.body;
      await this.service.leaveMeeting(roomId, type);
      return res.status(200).json({ message: 'Ended the meeting successfully!' });
    } catch (err: any) {
      if (err.message === 'Active meeting not found') {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: err.message });
    }
  };

  getMeetingStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId } = req.body;
      const meetings = await this.service.getActiveMeetingsForUser(userId);
      return res.status(200).json({ meetings });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };

  getMeetingUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { roomId } = req.body;
      const meetings = await this.service.getActiveMeetingsInRoom(roomId);
      return res.status(200).json({ meetings });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };
  
  getMeetingStatusRoom = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { roomId } = req.body;
      const status = await this.service.getRoomMeetingStatus(roomId);
      return res.status(200).json(status);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };
}