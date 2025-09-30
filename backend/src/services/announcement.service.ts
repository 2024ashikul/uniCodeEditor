import { AnnouncementRepository } from '../repositories/announcement.repository';
import { Announcement } from '../models/announcement.model';


interface CreateAnnouncementServiceDTO {
  roomId: string;
  userId: string;
  title: string;
  description: string;
}

export class AnnouncementService {
  private announcementRepo: AnnouncementRepository;

  constructor() {
    this.announcementRepo = new AnnouncementRepository();  
  }

 
  async createAnnouncement(data: CreateAnnouncementServiceDTO): Promise<Announcement> {
    
    if (!data.title ) {
      throw new Error('Title is required for an announcement.');
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