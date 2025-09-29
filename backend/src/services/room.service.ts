import { RoomRepository } from '../repositories/room.repository';

export class RoomService {
  private roomRepo: RoomRepository;

  constructor() {
    this.roomRepo = new RoomRepository();
  }

  async createRoom(userId: string, roomName: string) {
    
    const room = await this.roomRepo.createRoom({ admin: userId, name: roomName });
    await this.roomRepo.addMember({ userId, roomId: room.id, role: 'admin' });
    
   
    return this.roomRepo.findJoinedRoomDetails(userId, room.id);
  }

  async joinRoom(userId: string, roomId: number) {
    
    const roomExists = await this.roomRepo.findRoomById(roomId);
    if (!roomExists) {
      throw new Error('Room not found');
    }

    
    const isAlreadyMember = await this.roomRepo.findMember(userId, roomId);
    if (isAlreadyMember) {
      throw new Error('You have already joined this room');
    }

    await this.roomRepo.addMember({ userId, roomId, role: 'member' });
    return this.roomRepo.findJoinedRoomDetails(userId, roomId);
  }

  async getJoinedRooms(userId: string) {
    return this.roomRepo.findAllJoinedRooms(userId);
  }

  async getRoomMembers(roomId: number) {
    const members = await this.roomRepo.findAllMembersInRoom(roomId);
   
    return members.map(item => ({
      role: item.role,
      name: (item as any).user.name,
      email: (item as any).user.email,
      userId: (item as any).user.id,
    }));
  }

  async getRoomAdmin(roomId: number) {
    return this.roomRepo.findRoomById(roomId);
  }

  async toggleAdminRole(userId: string, roomId: number) {
    const member = await this.roomRepo.findMember(userId, roomId);
    if (!member) throw new Error('Member not found');

    
    member.role = member.role === 'admin' ? 'member' : 'admin';
    await member.save();
    return member;
  }

  async kickMember(userId: string, roomId: number) {
    const member = await this.roomRepo.findMember(userId, roomId);
    if (!member) throw new Error('Member not found');
    
    
    if (member.role === 'admin') {
      throw new Error('Cannot kick an admin from the room');
    }

    return this.roomRepo.removeMember(userId, roomId);
  }
}