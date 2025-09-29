import { MeetingRepository } from '../repositories/meeting.repository';
import { Meeting } from '../models/meeting.model';

export class MeetingService {
  private meetingRepo: MeetingRepository;

  constructor() {
    this.meetingRepo = new MeetingRepository();
  }

  async createMeeting(roomId: number, userId: string, type: string): Promise<Meeting> {
   
    const existingMeeting = await this.meetingRepo.findActiveMeetingByType(roomId, type);
    if (existingMeeting) {
      throw new Error('A meeting of this type is already active in this room.');
    }

    const newMeeting = await this.meetingRepo.create({
      roomId,
      status: 'active',
      type,
      host: userId
    });

   
    await this.meetingRepo.saveMeetingToCache(newMeeting);
    return newMeeting;
  }

  async leaveMeeting(roomId: number, type: string): Promise<Meeting> {
    const meeting = await this.meetingRepo.findActiveMeetingByType(roomId, type);
    if (!meeting) {
      throw new Error('Active meeting not found');
    }

    meeting.status = 'ended';
    return this.meetingRepo.save(meeting);
   
  }

  async getActiveMeetingsForUser(userId: string): Promise<Meeting[]> {
    const roomIds = await this.meetingRepo.findUserRoomIds(userId);
    if (roomIds.length === 0) {
      return [];
    }
    return this.meetingRepo.findActiveMeetingsByRoomIds(roomIds);
  }
  
  async getActiveMeetingsInRoom(roomId: number): Promise<Meeting[]> {
      return this.meetingRepo.findActiveMeetingsByRoomId(roomId);
  }

  async getRoomMeetingStatus(roomId: number) {
    
    const [activeCollaborateClassRoom, activeCollaborateRoom] = await Promise.all([
      this.meetingRepo.findActiveMeetingByType(roomId, 'collaborateclassroom'),
      this.meetingRepo.findActiveMeetingByType(roomId, 'collaborateroom')
    ]);
    return { activeCollaborateClassRoom, activeCollaborateRoom };
  }
}