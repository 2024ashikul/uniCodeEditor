
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';


import { authenticateToken } from '../middlewares/authMiddleware';
import { uploadProfilePhoto } from '../middlewares/uploadMiddleware';



const userController = new UserController();
const router = Router();


router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh-token', userController.refreshToken);


router.post('/editprofile', authenticateToken, userController.editProfile);
router.post('/getprofile', authenticateToken, userController.getProfile);
router.post('/user/changepassword', authenticateToken, userController.changePassword);
router.post('/user/uploadprofilephoto', authenticateToken, uploadProfilePhoto, userController.uploadProfilePhoto);

export default router;