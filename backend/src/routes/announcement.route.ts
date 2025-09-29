import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcement.controller';
import { authenticateToken } from '../middlewares/authMiddleware';


const announcementController = new AnnouncementController();
const router = Router();


router.post('/create', authenticateToken, announcementController.createAnnoucement);
router.post('/fetchall', authenticateToken, announcementController.fetchAnnoucements);

export default router;