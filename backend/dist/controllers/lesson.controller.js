"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonController = void 0;
const lesson_service_1 = require("../services/lesson.service");
class LessonController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const { contents, title, roomId } = req.body;
                await this.service.createLesson(title, roomId, contents);
                return res.status(201).json({ message: 'Created a new lesson' });
            }
            catch (err) {
                return res.status(500).json({ message: err.message || 'Could not create lesson' });
            }
        };
        this.update = async (req, res) => {
            try {
                const { contents, title, lessonId } = req.body;
                await this.service.updateLesson(lessonId, title, contents);
                return res.status(200).json({ message: "Lesson updated successfully" });
            }
            catch (err) {
                if (err.message === "Lesson not found") {
                    return res.status(404).json({ message: err.message });
                }
                return res.status(500).json({ message: err.message || 'Could not update lesson' });
            }
        };
        this.delete = async (req, res) => {
            try {
                const { lessonId } = req.body;
                await this.service.deleteLesson(lessonId);
                return res.status(200).json({ message: 'Deleted the lesson successfully' });
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
                const { lessonId } = req.body;
                const lesson = await this.service.getLessonWithContent(lessonId);
                if (!lesson) {
                    return res.status(404).json({ message: "Lesson not found" });
                }
                return res.status(200).json({ lesson });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.fetchAll = async (req, res) => {
            try {
                const { roomId } = req.body;
                const lessons = await this.service.getAllLessonsForRoom(roomId);
                return res.status(200).json({ message: 'Fetched lessons', lessons });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.service = new lesson_service_1.LessonService();
    }
}
exports.LessonController = LessonController;
