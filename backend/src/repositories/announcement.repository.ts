import { db } from '../models'; 
import { Announcement } from '../models/announcement.model';


interface CreateAnnouncementDTO {
  roomId: string;
  title: string;
  userId: string;
  description: string;
}

export class AnnouncementRepository {
  
  async create(data: CreateAnnouncementDTO): Promise<Announcement> {
    return db.Announcement.create(data);
  }

  
  async findAllByRoomId(roomId: string): Promise<Announcement[]> {
    return db.Announcement.findAll({
      where: { roomId },
      include: [
        {
          model: db.User,
          as: 'user', 
          attributes: ['id', 'name', 'profile_pic']
        }
      ],
      order: [['createdAt', 'DESC']],
    });
  }
}