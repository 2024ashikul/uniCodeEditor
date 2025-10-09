"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDB = exports.db = void 0;
const database_1 = __importDefault(require("../config/database"));
const user_model_1 = require("./user.model");
const room_model_1 = require("./room.model");
const roommember_model_1 = require("./roommember.model");
const assessment_model_1 = require("./assessment.model");
const submission_model_1 = require("./submission.model");
const problem_model_1 = require("./problem.model");
const announcement_model_1 = require("./announcement.model");
const lessonM_model_1 = require("./lessonM.model");
const lessonContent_model_1 = require("./lessonContent.model");
const meeting_model_1 = require("./meeting.model");
const material_model_1 = require("./material.model");
const models = {
    User: user_model_1.User,
    Room: room_model_1.Room,
    RoomMember: roommember_model_1.RoomMember,
    Assessment: assessment_model_1.Assessment,
    Submission: submission_model_1.Submission,
    Problem: problem_model_1.Problem,
    Announcement: announcement_model_1.Announcement,
    LessonM: lessonM_model_1.LessonM,
    LessonContent: lessonContent_model_1.LessonContent,
    Meeting: meeting_model_1.Meeting,
    Material: material_model_1.Material,
};
for (const model of Object.values(models)) {
    model.initialize(database_1.default);
}
for (const model of Object.values(models)) {
    if (model.associate) {
        model.associate(models);
    }
}
exports.db = {
    sequelize: database_1.default,
    ...models,
};
const syncDB = async () => {
    await database_1.default.sync({ alter: true }); // { force: true } to drop and recreate tables
    console.log('Database synchronized!');
};
exports.syncDB = syncDB;
