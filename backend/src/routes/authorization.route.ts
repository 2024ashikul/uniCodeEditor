import { Router } from 'express';
import { AuthorizationController } from '../controllers/authorization.controller';
import { authenticateToken } from '../middlewares/authMiddleware';



const authController = new AuthorizationController();
const router = Router();


router.post('/check-access', authenticateToken, authController.checkAccess);

export default router;