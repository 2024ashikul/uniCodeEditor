"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const submission_controller_1 = require("../controllers/submission.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const submissionController = new submission_controller_1.SubmissionController();
const router = (0, express_1.Router)();
router.post('/create', authMiddleware_1.authenticateToken, submissionController.submission); // For code
router.post('/bulk', authMiddleware_1.authenticateToken, submissionController.createBulkSubmissions); // For quizzes
router.post('/upload/project', authMiddleware_1.authenticateToken, uploadMiddleware_1.uploadProjectZip, submissionController.uploadProject);
router.post('/admin/results/quiz', authMiddleware_1.authenticateToken, submissionController.resultsForAdminQuiz);
router.post('/admin/project/submissions', authMiddleware_1.authenticateToken, submissionController.adminProjectSubmissions);
router.post('/admin/project/results', authMiddleware_1.authenticateToken, submissionController.adminProjectResults);
router.post('/admin/project/savescore', authMiddleware_1.authenticateToken, submissionController.ProjectSaveScore);
router.post('/user/results/quiz', authMiddleware_1.authenticateToken, submissionController.resultsForUserQuiz);
router.post('/user/project/results', authMiddleware_1.authenticateToken, submissionController.userResultProject);
exports.default = router;
