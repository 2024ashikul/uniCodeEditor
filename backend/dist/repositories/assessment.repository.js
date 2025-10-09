"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentRepository = void 0;
const models_1 = require("../models");
class AssessmentRepository {
    async findById(id) {
        return models_1.db.Assessment.findByPk(id);
    }
    async findAllByRoomId(roomId) {
        return models_1.db.Assessment.findAll({ where: { roomId } });
    }
    async findAllAssignedByRoomId(roomId) {
        return models_1.db.Assessment.findAll({ where: { roomId, status: 'assigned' } });
    }
    async create(data) {
        return models_1.db.Assessment.create(data);
    }
    async update(id, data) {
        return models_1.db.Assessment.update(data, { where: { id } });
    }
    async save(assessment) {
        return assessment.save();
    }
    async createAnnouncement(data) {
        return models_1.db.Announcement.create(data);
    }
}
exports.AssessmentRepository = AssessmentRepository;
