import { Router } from 'express';
import { SubmissionController } from '../controllers/submission.controller';


import { authenticateToken } from '../middlewares/authMiddleware';
import { uploadProjectZip } from '../middlewares/uploadMiddleware';



const submissionController = new SubmissionController();
const router = Router();


router.post('/create', authenticateToken, submissionController.submission); // For code
router.post('/bulk', authenticateToken, submissionController.createBulkSubmissions); // For quizzes
router.post('/upload/project', authenticateToken, uploadProjectZip, submissionController.uploadProject);


router.post('/admin/results/quiz', authenticateToken, submissionController.resultsForAdminQuiz);
router.post('/admin/project/submissions', authenticateToken, submissionController.adminProjectSubmissions);
router.post('/admin/project/results', authenticateToken, submissionController.adminProjectResults);
router.post('/admin/project/savescore', authenticateToken, submissionController.ProjectSaveScore);


router.post('/user/results/quiz', authenticateToken, submissionController.resultsForUserQuiz);
router.post('/user/project/results', authenticateToken, submissionController.userResultProject);

export default router;