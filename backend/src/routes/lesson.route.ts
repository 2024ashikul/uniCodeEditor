import { Router } from 'express';
import { LessonController } from '../controllers/lesson.controller';
import { authenticateToken } from '../middlewares/authMiddleware';


const lessonController = new LessonController();
const router = Router();

router.post('/delete', authenticateToken, lessonController.delete);
router.post('/fetchone', authenticateToken, lessonController.fetchOne);
router.post('/fetchall', authenticateToken, lessonController.fetchAll);
router.post('/create', authenticateToken, lessonController.create);
router.post('/update', authenticateToken, lessonController.update);

export default router;