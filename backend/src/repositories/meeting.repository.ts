import { db } from '../models'; // Your clean, refactored db object
import { Meeting } from '../models/meeting.model';


export class MeetingRepository {
  async findUserRoomIds(userId: string): Promise<number[]> {
    const roomMemberships = await db.RoomMember.findAll({
      where: { userId },
      attributes: ['roomId']
    });
    return roomMemberships.map(member => member.roomId);
  }

  async findActiveMeetingsByRoomIds(roomIds: number[]): Promise<Meeting[]> {
    return db.Meeting.findAll({
      where: {
        roomId: roomIds,
        status: 'active'
      }
    });
  }
  
  async findActiveMeetingsByRoomId(roomId: number): Promise<Meeting[]> {
      return db.Meeting.findAll({
          where: { roomId, status: 'active' }
      });
  }

  async findActiveMeetingByType(roomId: number, type: string, hostId?: string): Promise<Meeting | null> {
    const whereClause: any = { roomId, status: 'active', type };
    if (hostId) {
      whereClause.host = hostId;
    }
    return db.Meeting.findOne({ where: whereClause });
  }

  async create(data: { roomId: number; status: 'active'; type: string; host: string }): Promise<Meeting> {
    return db.Meeting.create(data);
  }
  
  async save(meeting: Meeting): Promise<Meeting> {
      return meeting.save();
  }

  
  async saveMeetingToCache(meeting: Meeting): Promise<void> {
    const key = `Room:${meeting.type}-${meeting.roomId}`;
    // await redisClient.set(key, JSON.stringify(meeting));
  }
}