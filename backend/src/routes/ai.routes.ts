import { Router } from 'express';
import { AiController } from '../controllers/ai.controller';
import { authenticateToken } from '../middlewares/authMiddleware';


const aiController = new AiController();
const router = Router();


router.post('/generate', authenticateToken, aiController.generate);
router.post('/generate/problem', authenticateToken, aiController.generateProblem);
router.post('/generate/lesson', authenticateToken, aiController.generateLesson);
router.post('/generate/code', authenticateToken, aiController.generateCode);

export default router;