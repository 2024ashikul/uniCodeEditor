"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionController = void 0;
const submission_service_1 = require("../services/submission.service");
class SubmissionController {
    constructor() {
        this.createBulkSubmissions = async (req, res) => {
            try {
                const { assessmentId, answers } = req.body;
                await this.service.createQuizSubmission(assessmentId, req.user.userId, answers);
                return res.status(201).json({ message: "Answers submitted successfully!" });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.submission = async (req, res) => {
            try {
                const { code, language, problemId } = req.body;
                await this.service.createCodeSubmission(problemId, req.user.userId, code, language);
                return res.status(201).json({ message: 'Submitted successfully!' });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.uploadProject = async (req, res) => {
            try {
                if (!req.file)
                    return res.status(400).json({ message: "No file was uploaded." });
                const { problemId, assessmentId } = req.body;
                const newSubmission = await this.service.createProjectSubmission(problemId, assessmentId, req.user.userId, req.file);
                return res.status(200).json({ message: 'Project uploaded successfully!', newSubmission });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.resultsForAdminQuiz = async (req, res) => {
            try {
                const { assessmentId } = req.body;
                const results = await this.service.getAdminQuizResults(assessmentId);
                return res.status(200).json({ results });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.resultsForUserQuiz = async (req, res) => {
            try {
                const { assessmentId } = req.body;
                const result = await this.service.getUserQuizResults(assessmentId, req.user.userId);
                return res.status(200).json(result);
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.adminProjectSubmissions = async (req, res) => {
            try {
                const { assessmentId } = req.body;
                const submissions = await this.service.getAdminProjectSubmissions(assessmentId);
                return res.status(200).json(submissions);
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.adminProjectResults = async (req, res) => {
            try {
                const { assessmentId } = req.body;
                const results = await this.service.getAdminProjectResults(assessmentId);
                return res.status(200).json({ results });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.ProjectSaveScore = async (req, res) => {
            try {
                const { assessmentId, userId, finalScore } = req.body;
                await this.service.saveProjectScore(assessmentId, userId, finalScore);
                return res.status(200).json({ message: 'Score Updated Successfully' });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.userResultProject = async (req, res) => {
            try {
                const { assessmentId } = req.body;
                const result = await this.service.getUserProjectResults(assessmentId, req.user.userId);
                return res.status(200).json(result);
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.service = new submission_service_1.SubmissionService();
    }
}
exports.SubmissionController = SubmissionController;
