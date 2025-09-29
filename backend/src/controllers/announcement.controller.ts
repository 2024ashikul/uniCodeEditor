import { Request, Response } from 'express';
import { AnnouncementService } from '../services/announcement.service';

export class AnnouncementController {
  private service: AnnouncementService;

  constructor() {
    this.service = new AnnouncementService();
  }

  createAnnoucement = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { roomId, form, userId } = req.body;
      
      const newAnnoucement = await this.service.createAnnouncement({
        roomId,
        userId,
        title: form.title,
        description: form.description,
      });

      return res.status(201).json({ newAnnoucement, message: 'New announcment created!' });
    } catch (err: any) {
      console.error(err); 
      return res.status(500).json({ message: err.message || 'Internal server error!' });
    }
  };

  fetchAnnoucements = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { roomId } = req.body;
      const announcements = await this.service.getAnnouncementsForRoom(roomId);
      return res.status(200).json(announcements);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: err.message || 'Internal server error!' });
    }
  };
}