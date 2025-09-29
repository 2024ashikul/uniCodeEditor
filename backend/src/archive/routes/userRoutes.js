const express = require('express')
const router = express.Router();
const userController = require('../../controllers/userController');
const { authenticateToken } = require('../../middlewares/authMiddleware');
const { uploadProfilePhoto } = require('../../middlewares/uploadMiddleware');


router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout',userController.logout)
router.post('/editprofile',authenticateToken,userController.editprofile)
router.post('/getprofile',authenticateToken,userController.getprofile)
router.post('/user/changepassword',authenticateToken,userController.changePassword)
router.post('/user/uploadprofilephoto', authenticateToken,uploadProfilePhoto, userController.uploadProfilePhoto)

module.exports = router;