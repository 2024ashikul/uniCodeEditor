import { Router } from 'express';
import { ProblemController } from '../controllers/problem.controller';
import { authenticateToken } from '../middlewares/authMiddleware';
authenticateToken


const problemController = new ProblemController();
const router = Router();


router.post('/create', authenticateToken, problemController.create);
router.post('/update', authenticateToken, problemController.update);
router.post('/delete', authenticateToken, problemController.delete);
router.post('/fetchone', authenticateToken, problemController.fetchOne);
router.post('/fetchall', authenticateToken, problemController.fetchAll);


router.post('/fetchone/project', authenticateToken, problemController.fetchOneProject);
router.post('/fetchall/quiz', authenticateToken, problemController.fetchAllQuiz);

export default router;