

const express = require('express')
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticateToken } = require('../middlewares/authMiddleware');


router.post('/create',authenticateToken,roomController.create);
router.post('/join', authenticateToken,roomController.join)
router.post('/members',authenticateToken,roomController.members)
router.post('/getadmin',authenticateToken,roomController.getAdmin)
router.post('/announcement/create',authenticateToken,roomController.createAnnoucement)
router.post('/announcement/fetchall',authenticateToken,roomController.fetchAnnoucements)
router.post('/joined',authenticateToken, roomController.roomsJoined)
router.post('/getuseraccess',authenticateToken,roomController.getUserAccess)

module.exports = router;