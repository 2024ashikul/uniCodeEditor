"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const room_repository_1 = require("../repositories/room.repository");
class RoomService {
    constructor() {
        this.roomRepo = new room_repository_1.RoomRepository();
    }
    async createRoom(userId, roomName) {
        const room = await this.roomRepo.createRoom({ admin: userId, name: roomName });
        await this.roomRepo.addMember({ userId, roomId: room.id, role: 'admin' });
        return this.roomRepo.findJoinedRoomDetails(userId, room.id);
    }
    async joinRoom(userId, roomId) {
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
    async getJoinedRooms(userId) {
        return this.roomRepo.findAllJoinedRooms(userId);
    }
    async getRoomMembers(roomId) {
        const members = await this.roomRepo.findAllMembersInRoom(roomId);
        return members.map(item => ({
            role: item.role,
            name: item.user.name,
            email: item.user.email,
            userId: item.user.id,
        }));
    }
    async getRoomAdmin(roomId) {
        return this.roomRepo.findRoomById(roomId);
    }
    async toggleAdminRole(userId, roomId) {
        const member = await this.roomRepo.findMember(userId, roomId);
        if (!member)
            throw new Error('Member not found');
        member.role = member.role === 'admin' ? 'member' : 'admin';
        await member.save();
        return member;
    }
    async kickMember(userId, roomId) {
        const member = await this.roomRepo.findMember(userId, roomId);
        if (!member)
            throw new Error('Member not found');
        if (member.role === 'admin') {
            throw new Error('Cannot kick an admin from the room');
        }
        return this.roomRepo.removeMember(userId, roomId);
    }
}
exports.RoomService = RoomService;
