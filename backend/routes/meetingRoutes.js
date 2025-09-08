const express = require('express');
const meetingController = require('../controllers/meetingController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/getstatus',authenticateToken,meetingController.getMeetingStatus)
router.post('/room/getstatus',authenticateToken,meetingController.getMeetingStatusRoom)
router.post('/create',authenticateToken,meetingController.create)
router.post('/user',authenticateToken, meetingController.getMeetingUser)
router.post('/leave',authenticateToken, meetingController.leave)
module.exports = router;

