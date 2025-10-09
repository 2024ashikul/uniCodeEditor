"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRepository = void 0;
const models_1 = require("../models"); // Your clean, refactored db object
class RoomRepository {
    async createRoom(data) {
        return models_1.db.Room.create(data);
    }
    async findRoomById(id) {
        return models_1.db.Room.findByPk(id);
    }
    async findMember(userId, roomId) {
        return models_1.db.RoomMember.findOne({ where: { userId, roomId } });
    }
    async addMember(data) {
        return models_1.db.RoomMember.create(data);
    }
    async findJoinedRoomDetails(userId, roomId) {
        return models_1.db.RoomMember.findOne({
            where: { userId, roomId },
            include: [{
                    model: models_1.db.Room,
                    as: 'room',
                    include: [{ model: models_1.db.User, as: 'administrator', attributes: ['id', 'name', 'profile_pic'] }]
                }]
        });
    }
    async findAllJoinedRooms(userId) {
        return models_1.db.RoomMember.findAll({
            where: { userId },
            include: [{
                    model: models_1.db.Room,
                    as: 'room',
                    include: [{
                            model: models_1.db.User,
                            as: 'administrator',
                            attributes: ['id', 'name', 'profile_pic']
                        }]
                }]
        });
    }
    async findAllMembersInRoom(roomId) {
        return models_1.db.RoomMember.findAll({
            where: { roomId },
            include: [{ model: models_1.db.User, as: 'user', attributes: ['name', 'email', 'id'] }]
        });
    }
    async removeMember(userId, roomId) {
        return models_1.db.RoomMember.destroy({ where: { userId, roomId } });
    }
}
exports.RoomRepository = RoomRepository;
