"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentController = void 0;
const assessment_service_1 = require("../services/assessment.service");
const assessment_repository_1 = require("../repositories/assessment.repository");
class AssessmentController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const { roomId, userId, form, assessmentId } = req.body;
                const assessment = await this.service.createOrUpdate({
                    roomId, userId, ...form, assessmentId
                });
                const message = assessmentId ? 'Assessment updated successfully' : 'Assessment created successfully';
                return res.status(201).json({ assessment, message });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.fetchOne = async (req, res) => {
            try {
                const { assessmentId } = req.body;
                const assessment = await this.service.findOne(assessmentId);
                if (!assessment)
                    return res.status(404).json({ message: 'Assessment not found' });
                return res.status(200).json(assessment);
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.fetchAll = async (req, res) => {
            try {
                const { roomId } = req.body;
                const assessments = await this.service.findAll(roomId);
                return res.status(200).json(assessments);
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.fetchAllUser = async (req, res) => {
            try {
                const { roomId } = req.body;
                const assessments = await this.service.findAllAssignedForUser(roomId);
                return res.status(200).json(assessments);
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.changeSchedule = async (req, res) => {
            try {
                const { assessmentId, userId, form } = req.body;
                const assessment = await this.service.scheduleAndNotify(assessmentId, userId, form);
                return res.status(200).json(assessment);
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.publishResult = async (req, res) => {
            try {
                const { assessmentId } = req.body;
                await this.service.publishResults(assessmentId);
                return res.status(200).json({ message: 'Result Published successfully' });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.changeWhoCanSeeResults = async (req, res) => {
            try {
                const { assessmentId } = req.body;
                await this.service.toggleEveryoneSeesResults(assessmentId);
                return res.status(200).json({ message: 'Visibility updated successfully' });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        //  DI container should provide the repository in production
        const repository = new assessment_repository_1.AssessmentRepository();
        this.service = new assessment_service_1.AssessmentService(repository);
    }
}
exports.AssessmentController = AssessmentController;
