import { Router } from 'express';
import { FileController } from '../controllers/file.controller';
import { authenticateToken } from '../middlewares/authMiddleware';

const fileController = new FileController();
const router = Router();


router.get('/download/submission/:folder', authenticateToken, fileController.downloadSubmission);
router.get('/download/material/:folder', authenticateToken, fileController.downloadMaterial);

export default router;