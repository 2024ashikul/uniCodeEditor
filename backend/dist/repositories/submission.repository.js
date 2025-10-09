"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionRepository = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const unzipper_1 = __importDefault(require("unzipper"));
class SubmissionRepository {
    async bulkCreate(data) {
        return models_1.db.Submission.bulkCreate(data);
    }
    async create(data) {
        return models_1.db.Submission.create(data);
    }
    async save(submission) {
        return submission.save();
    }
    async findAssessmentById(id) {
        return models_1.db.Assessment.findByPk(id);
    }
    async findProblemById(id) {
        return models_1.db.Problem.findByPk(id);
    }
    async findOneProblemByAssessmentId(assessmentId) {
        return models_1.db.Problem.findOne({ where: { assessmentId } });
    }
    async findAllProblemsByAssessmentId(assessmentId) {
        return models_1.db.Problem.findAll({ where: { assessmentId } });
    }
    async findAllMembersInRoom(roomId, excludeAdmins = false) {
        const whereClause = { roomId };
        if (excludeAdmins) {
            whereClause.role = { [sequelize_1.Op.ne]: "admin" };
        }
        return models_1.db.RoomMember.findAll({
            where: whereClause,
            include: [{ model: models_1.db.User, as: 'user', attributes: ['name', 'email', 'id'] }]
        });
    }
    async findSubmissionsByProblemIds(problemIds) {
        return models_1.db.Submission.findAll({
            where: { problemId: { [sequelize_1.Op.in]: problemIds } },
            include: [{ model: models_1.db.User, as: 'user', attributes: ['id', 'email', 'name'] }]
        });
    }
    async findSubmissionsByProblemIdsAndUser(problemIds, userId) {
        return models_1.db.Submission.findAll({
            where: {
                problemId: { [sequelize_1.Op.in]: problemIds },
                userId: userId
            },
            include: [{ model: models_1.db.User, as: 'user', attributes: ['id', 'email', 'name'] }]
        });
    }
    async findOneSubmission(problemId, userId) {
        return models_1.db.Submission.findOne({ where: { problemId, userId } });
    }
    async saveCodeToFile(code, timestamp, extension) {
        const filesDir = path_1.default.join(process.cwd(), 'files');
        await promises_1.default.mkdir(filesDir, { recursive: true });
        const filePath = path_1.default.join(filesDir, `${timestamp}.${extension}`);
        await promises_1.default.writeFile(filePath, code);
    }
    async unzipProject(tempPath, destinationPath) {
        await promises_1.default.mkdir(destinationPath, { recursive: true });
        await (0, fs_1.createReadStream)(tempPath).pipe(unzipper_1.default.Extract({ path: destinationPath })).promise();
    }
    async deleteFile(filePath) {
        try {
            await promises_1.default.unlink(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT')
                throw err;
        }
    }
}
exports.SubmissionRepository = SubmissionRepository;
