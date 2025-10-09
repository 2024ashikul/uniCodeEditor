"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationRepository = void 0;
const models_1 = require("../models");
class AuthorizationRepository {
    async findRoomMembership(userId, roomId) {
        return models_1.db.RoomMember.findOne({
            where: { userId, roomId },
            include: [{ model: models_1.db.Room, as: 'room', attributes: ['name'] }]
        });
    }
    async findAssessmentById(assessmentId) {
        return models_1.db.Assessment.findByPk(assessmentId);
    }
    async findProblemById(problemId) {
        return models_1.db.Problem.findByPk(problemId);
    }
}
exports.AuthorizationRepository = AuthorizationRepository;
