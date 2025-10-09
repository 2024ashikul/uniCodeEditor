"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationService = void 0;
const authorization_respository_1 = require("../repositories/authorization.respository");
class AuthorizationService {
    constructor() {
        this.authRepo = new authorization_respository_1.AuthorizationRepository();
    }
    async checkRoomAccess(userId, roomId) {
        const membership = await this.authRepo.findRoomMembership(userId, roomId);
        if (membership) {
            return {
                allowed: true,
                message: 'Access granted to room.',
                role: membership.role,
                details: { name: membership.room.name }
            };
        }
        return { allowed: false, message: 'User is not a member of this room.' };
    }
    async checkAssessmentAccess(userId, assessmentId) {
        const assessment = await this.authRepo.findAssessmentById(assessmentId);
        if (!assessment) {
            return { allowed: false, message: 'Assessment not found.' };
        }
        const roomAccess = await this.checkRoomAccess(userId, assessment.roomId);
        if (roomAccess.allowed) {
            roomAccess.details = {
                ...roomAccess.details,
                type: assessment.category,
                scheduleTime: assessment.scheduleTime,
                duration: assessment.duration,
                status: assessment.status,
                title: assessment.title
            };
            return roomAccess;
        }
        return { allowed: false, message: 'User does not have access to the assessment\'s room.' };
    }
    async checkProblemAccess(userId, problemId) {
        const problem = await this.authRepo.findProblemById(problemId);
        if (!problem) {
            return { allowed: false, message: 'Problem not found.' };
        }
        return this.checkAssessmentAccess(userId, problem.assessmentId);
    }
}
exports.AuthorizationService = AuthorizationService;
