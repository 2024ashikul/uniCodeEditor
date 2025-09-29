import { Router } from 'express';
import { MaterialController } from '../controllers/material.controller';

import { authenticateToken } from '../middlewares/authMiddleware';
import { uploadMaterialFile, uploadMaterialZip } from '../middlewares/uploadMiddleware';




const materialController = new MaterialController();
const router = Router();


router.post('/upload/folder', authenticateToken, uploadMaterialZip, materialController.uploadFolder);
router.post('/upload/file', authenticateToken, uploadMaterialFile, materialController.uploadFile);
router.post('/fetchall', authenticateToken, materialController.fetchall);
router.post('/delete', authenticateToken, materialController.delete);

export default router;