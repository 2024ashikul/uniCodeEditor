"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingRepository = void 0;
const models_1 = require("../models"); // Your clean, refactored db object
class MeetingRepository {
    async findUserRoomIds(userId) {
        const roomMemberships = await models_1.db.RoomMember.findAll({
            where: { userId },
            attributes: ['roomId']
        });
        return roomMemberships.map(member => member.roomId);
    }
    async findActiveMeetingsByRoomIds(roomIds) {
        return models_1.db.Meeting.findAll({
            where: {
                roomId: roomIds,
                status: 'active'
            }
        });
    }
    async findActiveMeetingsByRoomId(roomId) {
        return models_1.db.Meeting.findAll({
            where: { roomId, status: 'active' }
        });
    }
    async findActiveMeetingByType(roomId, type, hostId) {
        const whereClause = { roomId, status: 'active', type };
        if (hostId) {
            whereClause.host = hostId;
        }
        return models_1.db.Meeting.findOne({ where: whereClause });
    }
    async create(data) {
        return models_1.db.Meeting.create(data);
    }
    async save(meeting) {
        return meeting.save();
    }
    async saveMeetingToCache(meeting) {
        const key = `Room:${meeting.type}-${meeting.roomId}`;
        // await redisClient.set(key, JSON.stringify(meeting));
    }
}
exports.MeetingRepository = MeetingRepository;
