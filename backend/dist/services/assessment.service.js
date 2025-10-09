"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentService = void 0;
class AssessmentService {
    constructor(assessmentRepo) {
        this.assessmentRepo = assessmentRepo;
    }
    async createOrUpdate(data) {
        if (data.assessmentId) {
            const assessment = await this.assessmentRepo.findById(data.assessmentId);
            if (!assessment)
                throw new Error('Assessment not found');
            assessment.title = data.title;
            assessment.description = data.description;
            return this.assessmentRepo.save(assessment);
        }
        else {
            return this.assessmentRepo.create(data);
        }
    }
    async findOne(assessmentId) {
        return this.assessmentRepo.findById(assessmentId);
    }
    async findAll(roomId) {
        return this.assessmentRepo.findAllByRoomId(roomId);
    }
    async findAllAssignedForUser(roomId) {
        return this.assessmentRepo.findAllAssignedByRoomId(roomId);
    }
    async scheduleAndNotify(assessmentId, userId, form) {
        const assessment = await this.assessmentRepo.findById(assessmentId);
        if (!assessment)
            throw new Error('Assessment not found');
        assessment.scheduleTime = new Date(form.datetime);
        assessment.status = 'assigned';
        assessment.duration = parseInt(form.duration, 10);
        assessment.assigned = form.assigned;
        await this.assessmentRepo.save(assessment);
        if (assessment.assigned) {
            const title = `New ${assessment.category} ${assessment.title} assigned!`;
            await this.assessmentRepo.createAnnouncement({
                roomId: assessment.roomId,
                title: title,
                userId: userId,
                description: `The ${assessment.category} is scheduled for ${assessment.scheduleTime} and its duration is ${assessment.duration} mins`,
                category: assessment.category,
            });
        }
        return assessment;
    }
    async publishResults(assessmentId) {
        const assessment = await this.assessmentRepo.findById(assessmentId);
        if (!assessment)
            throw new Error('Assessment not found.');
        assessment.resultpublished = true;
        await this.assessmentRepo.save(assessment);
    }
    async toggleEveryoneSeesResults(assessmentId) {
        const assessment = await this.assessmentRepo.findById(assessmentId);
        if (!assessment)
            throw new Error('Assessment not found.');
        assessment.everyoneseesresults = !assessment.everyoneseesresults;
        await this.assessmentRepo.save(assessment);
    }
}
exports.AssessmentService = AssessmentService;
