"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementRepository = void 0;
const models_1 = require("../models");
class AnnouncementRepository {
    async create(data) {
        return models_1.db.Announcement.create(data);
    }
    async findAllByRoomId(roomId) {
        return models_1.db.Announcement.findAll({
            where: { roomId },
            include: [
                {
                    model: models_1.db.User,
                    as: 'user',
                    attributes: ['id', 'name', 'profile_pic']
                }
            ],
            order: [['createdAt', 'DESC']],
        });
    }
}
exports.AnnouncementRepository = AnnouncementRepository;
