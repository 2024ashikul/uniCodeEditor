"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemController = void 0;
const problem_service_1 = require("../services/problem.service");
class ProblemController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const { assessmentId, form, type } = req.body;
                const newProblem = await this.service.createProblem(assessmentId, form, type);
                return res.status(201).json({ newProblem, message: 'New Problem created!' });
            }
            catch (err) {
                return res.status(500).json({ message: err.message || 'Internal Server Error' });
            }
        };
        this.update = async (req, res) => {
            try {
                const { editProblemId, form, type } = req.body;
                const problem = await this.service.updateProblem(editProblemId, form, type);
                return res.status(200).json({ problem, message: 'Problem updated' });
            }
            catch (err) {
                if (err.message === 'Problem not found') {
                    return res.status(404).json({ message: err.message });
                }
                return res.status(500).json({ message: err.message });
            }
        };
        this.fetchAll = async (req, res) => {
            try {
                const { assessmentId } = req.body;
                const problems = await this.service.findAll(assessmentId);
                return res.status(200).json(problems);
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.fetchOneProject = async (req, res) => {
            try {
                const { assessmentId } = req.body;
                const { problem, submission, submitted } = await this.service.getProjectWithSubmissionStatus(assessmentId, req.user.userId);
                if (!problem)
                    return res.status(404).json({ message: 'No problem found for this project' });
                return res.status(200).json({ problem, submission, submitted });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.fetchAllQuiz = async (req, res) => {
            try {
                const { assessmentId } = req.body;
                const result = await this.service.getQuizWithSubmissionStatus(assessmentId, req.user.userId);
                return res.status(200).json(result);
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.delete = async (req, res) => {
            try {
                const { problemId } = req.body;
                await this.service.deleteProblem(problemId);
                return res.status(200).json({ message: 'Problem deleted' });
            }
            catch (err) {
                if (err.message.includes('not found')) {
                    return res.status(404).json({ message: err.message });
                }
                return res.status(500).json({ message: err.message });
            }
        };
        this.fetchOne = async (req, res) => {
            try {
                const { problemId } = req.body;
                const problem = await this.service.findOne(problemId);
                if (!problem)
                    return res.status(404).json({ message: 'Problem not found!' });
                return res.status(200).json(problem);
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.service = new problem_service_1.ProblemService();
    }
}
exports.ProblemController = ProblemController;
