"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonRepository = void 0;
const models_1 = require("../models"); // Your clean, refactored db object
class LessonRepository {
    async createLesson(data) {
        return models_1.db.LessonM.create(data);
    }
    async createLessonContents(lessonId, contents) {
        const contentsWithId = contents.map(c => ({ ...c, lessonId }));
        return models_1.db.LessonContent.bulkCreate(contentsWithId);
    }
    async findLessonById(id) {
        return models_1.db.LessonM.findByPk(id);
    }
    async findLessonWithContent(id) {
        return models_1.db.LessonM.findByPk(id, {
            include: [{ model: models_1.db.LessonContent, as: 'lessonContents' }]
        });
    }
    async findAllByRoomId(roomId) {
        return models_1.db.LessonM.findAll({ where: { roomId } });
    }
    async updateLesson(id, title) {
        return models_1.db.LessonM.update({ title }, { where: { id } });
    }
    async deleteLessonContents(lessonId) {
        return models_1.db.LessonContent.destroy({ where: { lessonId } });
    }
    async deleteLesson(id) {
        return models_1.db.LessonM.destroy({ where: { id } });
    }
}
exports.LessonRepository = LessonRepository;
