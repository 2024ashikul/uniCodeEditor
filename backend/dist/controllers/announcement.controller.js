"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementController = void 0;
const announcement_service_1 = require("../services/announcement.service");
class AnnouncementController {
    constructor() {
        this.createAnnoucement = async (req, res) => {
            try {
                const { roomId, form, userId } = req.body;
                const newAnnoucement = await this.service.createAnnouncement({
                    roomId,
                    userId,
                    title: form.title,
                    description: form.description,
                });
                return res.status(201).json({ newAnnoucement, message: 'New announcment created!' });
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: err.message || 'Internal server error!' });
            }
        };
        this.fetchAnnoucements = async (req, res) => {
            try {
                const { roomId } = req.body;
                const announcements = await this.service.getAnnouncementsForRoom(roomId);
                return res.status(200).json(announcements);
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: err.message || 'Internal server error!' });
            }
        };
        this.service = new announcement_service_1.AnnouncementService();
    }
}
exports.AnnouncementController = AnnouncementController;
