import { Router } from 'express';
import { ProblemController } from '../controllers/problem.controller';
import { authenticateToken } from '../middlewares/authMiddleware';
authenticateToken


const problemController = new ProblemController();
const router = Router();

// Admin routes
router.post('/admin/create', authenticateToken, problemController.create);
router.post('/admin/update', authenticateToken, problemController.update);
router.post('/admin/delete', authenticateToken, problemController.delete);
router.post('/admin/fetchone', authenticateToken, problemController.fetchOne);
router.post('/admin/fetchall', authenticateToken, problemController.fetchAll);

// User-facing routes
router.post('/user/fetchproject', authenticateToken, problemController.fetchOneProject);
router.post('/user/fetchallquiz', authenticateToken, problemController.fetchAllQuiz);

export default router;