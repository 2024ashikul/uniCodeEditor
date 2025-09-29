import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller';
import { authenticateToken } from '../../middlewares/authMiddleware';


const assessmentController = new AssessmentController();
const router = Router();


router.post('/create', authenticateToken, assessmentController.create);
router.post('/fetchone', authenticateToken, assessmentController.fetchOne);


router.post('/admin/fetchall', authenticateToken, assessmentController.fetchAll);
router.post('/admin/schedule', authenticateToken, assessmentController.changeSchedule);
router.post('/admin/publishresults', authenticateToken, assessmentController.publishResult);
router.post('/admin/changewhocanseeresults', authenticateToken, assessmentController.changeWhoCanSeeResults);


router.post('/user/fetchall', authenticateToken, assessmentController.fetchAllUser);

export default router;