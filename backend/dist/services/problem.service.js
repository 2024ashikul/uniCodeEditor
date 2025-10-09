"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemService = void 0;
const problem_repository_1 = require("../repositories/problem.repository");
class ProblemService {
    constructor() {
        this.problemRepo = new problem_repository_1.ProblemRepository();
    }
    async createProblem(assessmentId, form, type) {
        let problemData = {
            assessmentId,
            title: form.title,
        };
        if (type === 'MCQ') {
            problemData = { ...problemData, type: "MCQ", options: form.options, fullmarks: form.fullmarks || 1, correctAnswer: form.correctAnswer };
        }
        else if (type === 'ShortQuestion') {
            problemData = { ...problemData, type: "ShortQuestion", fullmarks: form.fullmarks || 5, correctAnswer: form.correctAnswer };
        }
        else {
            problemData = { ...problemData, statement: form.statement, fullmarks: form.fullmarks || 10 };
        }
        return this.problemRepo.create(problemData);
    }
    async updateProblem(problemId, form, type) {
        const problem = await this.problemRepo.findById(problemId);
        if (!problem)
            throw new Error('Problem not found');
        if (type === "MCQ") {
            problem.title = form.title;
            problem.options = form.options;
            problem.fullmarks = form.fullmarks || 1;
            problem.correctAnswer = form.correctAnswer;
        }
        else if (type == 'ShortQuestion') {
            problem.title = form.title;
            problem.fullmarks = form.fullmarks || 5;
            problem.correctAnswer = form.correctAnswer;
        }
        else {
            problem.title = form.title;
            problem.statement = form.statement;
            problem.fullmarks = form.fullmarks || problem.fullmarks;
            problem.correctAnswer = form.correctAnswer;
        }
        await problem.save();
        return problem;
    }
    async getProjectWithSubmissionStatus(assessmentId, userId) {
        const problem = await this.problemRepo.findOneByAssessmentId(assessmentId);
        if (!problem)
            return { problem: null, submitted: false };
        const submission = await this.problemRepo.findUserSubmissionForProblem(problem.id, userId);
        return { problem, submission, submitted: !!submission };
    }
    async getQuizWithSubmissionStatus(assessmentId, userId) {
        const problems = await this.problemRepo.findAllByAssessmentId(assessmentId);
        if (problems.length === 0) {
            return { problems: [], submissions: [], submitted: false };
        }
        const problemIds = problems.map(p => p.id);
        const submissions = await this.problemRepo.findUserSubmissionsForProblems(problemIds, userId);
        return { problems, submissions, submitted: submissions.length > 0 };
    }
    async deleteProblem(problemId) {
        const deletedCount = await this.problemRepo.deleteById(problemId);
        if (deletedCount === 0)
            throw new Error('Problem not found or already deleted');
        return true;
    }
    async findOne(problemId) {
        return this.problemRepo.findById(problemId);
    }
    async findAll(assessmentId) {
        return this.problemRepo.findAllByAssessmentId(assessmentId);
    }
}
exports.ProblemService = ProblemService;
