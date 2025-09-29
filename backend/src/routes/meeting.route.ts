import { Router } from 'express';
import { MeetingController } from '../controllers/meeting.controller';
import { authenticateToken } from '../middlewares/authMiddleware';


const meetingController = new MeetingController();
const router = Router();

router.post('/create', authenticateToken, meetingController.create);
router.post('/leave', authenticateToken, meetingController.leave);
router.post('/getstatus', authenticateToken, meetingController.getMeetingStatus);
router.post('/user', authenticateToken, meetingController.getMeetingUser);
router.post('/room/getstatus', authenticateToken, meetingController.getMeetingStatusRoom);

export default router;