const express = require('express')
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/create',authenticateToken,announcementController.createAnnoucement)
router.post('/fetchall',authenticateToken,announcementController.fetchAnnoucements)


module.exports = router;