"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemRepository = void 0;
const models_1 = require("../models"); // Your clean, refactored db object
const sequelize_1 = require("sequelize");
class ProblemRepository {
    async create(data) {
        return models_1.db.Problem.create(data);
    }
    async update(id, data) {
        return models_1.db.Problem.update(data, { where: { id } });
    }
    async findById(id) {
        return models_1.db.Problem.findByPk(id);
    }
    async findAllByAssessmentId(assessmentId) {
        return models_1.db.Problem.findAll({ where: { assessmentId } });
    }
    async findOneByAssessmentId(assessmentId) {
        return models_1.db.Problem.findOne({ where: { assessmentId } });
    }
    async findUserSubmissionForProblem(problemId, userId) {
        return models_1.db.Submission.findOne({ where: { problemId, userId } });
    }
    async findUserSubmissionsForProblems(problemIds, userId) {
        return models_1.db.Submission.findAll({
            where: {
                userId,
                problemId: { [sequelize_1.Op.in]: problemIds }
            }
        });
    }
    async deleteById(id) {
        return models_1.db.Problem.destroy({ where: { id } });
    }
}
exports.ProblemRepository = ProblemRepository;
