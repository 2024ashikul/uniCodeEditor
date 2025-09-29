import { db } from '../models'; // Your clean, refactored db object
import { Room } from '../models/room.model';
import { RoomMember } from '../models/roommember.model';

import { User } from '../models/user.model';

export class RoomRepository {
  async createRoom(data: { admin: string; name: string }): Promise<Room> {
    return db.Room.create(data);
  }

  async findRoomById(id: number): Promise<Room | null> {
    return db.Room.findByPk(id);
  }

  async findMember(userId: string, roomId: number): Promise<RoomMember | null> {
    return db.RoomMember.findOne({ where: { userId, roomId } });
  }

  async addMember(data: { userId: string; roomId: number; role: 'admin' | 'member' }): Promise<RoomMember> {
    return db.RoomMember.create(data);
  }

  async findJoinedRoomDetails(userId: string, roomId: number): Promise<RoomMember | null> {
    return db.RoomMember.findOne({
      where: { userId, roomId },
      include: [{
        model: db.Room,
        as: 'room', // Ensure this alias matches your model association
        include: [{ model: db.User, as: 'user', attributes: ['id', 'name', 'profile_pic'] }]
      }]
    });
  }

  async findAllJoinedRooms(userId: string): Promise<RoomMember[]> {
    return db.RoomMember.findAll({
      where: { userId },
      include: [{
        model: db.Room,
        as: 'room', 
        include: [{
          model: db.User,
          as: 'administrator', 
          attributes: ['id', 'name', 'profile_pic']
        }]
      }]
    });
  }

  async findAllMembersInRoom(roomId: number): Promise<RoomMember[]> {
    return db.RoomMember.findAll({
      where: { roomId },
      include: [{ model: db.User, as: 'user', attributes: ['name', 'email', 'id'] }]
    });
  }

  async removeMember(userId: string, roomId: number): Promise<number> {
    return db.RoomMember.destroy({ where: { userId, roomId } });
  }
}