"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingService = void 0;
const meeting_repository_1 = require("../repositories/meeting.repository");
class MeetingService {
    constructor() {
        this.meetingRepo = new meeting_repository_1.MeetingRepository();
    }
    async createMeeting(roomId, userId, type) {
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
    async leaveMeeting(roomId, type) {
        const meeting = await this.meetingRepo.findActiveMeetingByType(roomId, type);
        if (!meeting) {
            throw new Error('Active meeting not found');
        }
        meeting.status = 'ended';
        return this.meetingRepo.save(meeting);
    }
    async getActiveMeetingsForUser(userId) {
        const roomIds = await this.meetingRepo.findUserRoomIds(userId);
        if (roomIds.length === 0) {
            return [];
        }
        return this.meetingRepo.findActiveMeetingsByRoomIds(roomIds);
    }
    async getActiveMeetingsInRoom(roomId) {
        return this.meetingRepo.findActiveMeetingsByRoomId(roomId);
    }
    async getRoomMeetingStatus(roomId) {
        const [activeCollaborateClassRoom, activeCollaborateRoom] = await Promise.all([
            this.meetingRepo.findActiveMeetingByType(roomId, 'collaborateclassroom'),
            this.meetingRepo.findActiveMeetingByType(roomId, 'collaborateroom')
        ]);
        return { activeCollaborateClassRoom, activeCollaborateRoom };
    }
}
exports.MeetingService = MeetingService;
