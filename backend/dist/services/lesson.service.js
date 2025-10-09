"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonService = void 0;
const lesson_repository_1 = require("../repositories/lesson.repository");
class LessonService {
    constructor() {
        this.lessonRepo = new lesson_repository_1.LessonRepository();
    }
    async createLesson(title, roomId, contents) {
        // Business Logic: A lesson and its content are created together.
        const newLesson = await this.lessonRepo.createLesson({ title, roomId });
        if (contents && contents.length > 0) {
            await this.lessonRepo.createLessonContents(newLesson.id, contents);
        }
        return newLesson;
    }
    async updateLesson(lessonId, title, contents) {
        const lesson = await this.lessonRepo.findLessonById(lessonId);
        if (!lesson) {
            throw new Error("Lesson not found");
        }
        // Business Logic: Update the title and replace the entire content block.
        await this.lessonRepo.updateLesson(lessonId, title);
        await this.lessonRepo.deleteLessonContents(lessonId); // Delete old content
        await this.lessonRepo.createLessonContents(lessonId, contents); // Add new content
        const updatedLesson = await this.lessonRepo.findLessonWithContent(lessonId);
        if (!updatedLesson)
            throw new Error("Could not retrieve updated lesson");
        return updatedLesson;
    }
    async deleteLesson(lessonId) {
        const deletedCount = await this.lessonRepo.deleteLesson(lessonId);
        if (deletedCount === 0) {
            throw new Error("Lesson not found or already deleted");
        }
    }
    async getLessonWithContent(lessonId) {
        return this.lessonRepo.findLessonWithContent(lessonId);
    }
    async getAllLessonsForRoom(roomId) {
        return this.lessonRepo.findAllByRoomId(roomId);
    }
}
exports.LessonService = LessonService;
