"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementService = void 0;
const announcement_repository_1 = require("../repositories/announcement.repository");
class AnnouncementService {
    constructor() {
        this.announcementRepo = new announcement_repository_1.AnnouncementRepository();
    }
    async createAnnouncement(data) {
        if (!data.title) {
            throw new Error('Title is required for an announcement.');
        }
        return this.announcementRepo.create({
            roomId: data.roomId,
            userId: data.userId,
            title: data.title,
            description: data.description,
        });
    }
    async getAnnouncementsForRoom(roomId) {
        if (!roomId) {
            throw new Error('Room ID is required to fetch announcements.');
        }
        return this.announcementRepo.findAllByRoomId(roomId);
    }
}
exports.AnnouncementService = AnnouncementService;
