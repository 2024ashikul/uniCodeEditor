import { AnnouncementRepository } from '../repositories/announcement.repository';
import { Announcement } from '../models/announcement.model';

// DTO to define the shape of the data needed to create an announcement
interface CreateAnnouncementServiceDTO {
  roomId: string;
  userId: string;
  title: string;
  description: string;
}

export class AnnouncementService {
  private announcementRepo: AnnouncementRepository;

  constructor() {
    this.announcementRepo = new AnnouncementRepository(); // Simple instantiation
  }

 
  async createAnnouncement(data: CreateAnnouncementServiceDTO): Promise<Announcement> {
    
    if (!data.title || !data.description) {
      throw new Error('Title and description are required for an announcement.');
    }

   
    return this.announcementRepo.create({
      roomId: data.roomId,
      userId: data.userId,
      title: data.title,
      description: data.description,
    });
  }

 
  async getAnnouncementsForRoom(roomId: string): Promise<Announcement[]> {
    if (!roomId) {
        throw new Error('Room ID is required to fetch announcements.');
    }
    return this.announcementRepo.findAllByRoomId(roomId);
  }
}