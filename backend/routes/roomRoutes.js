

const express = require('express')
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticateToken } = require('../middlewares/authMiddleware');


router.post('/createroom',authenticateToken,roomController.createRoom);
router.post('/joinroom', authenticateToken,roomController.joinRoom)
router.post('/loadrooms',authenticateToken,roomController.loadRooms)
router.post('/roommembers',roomController.roomMembers)
router.post('/getadmin',roomController.getAdmin)
router.post('/createannoucemnet',roomController.createAnnoucement)
router.post('/fetchannouncements',roomController.fetchAnnoucements)
router.post('/resultsforadmin',authenticateToken,roomController.resultsForAdmin)
router.post('/resultsforuser',roomController.resultsForUser)
router.post('/loadroomsjoined',authenticateToken, roomController.loadRoomsJoined)
router.post('/getuseraccess',roomController.getUserAccess)
router.post('/createlesson',roomController.createLesson)
router.post('/updatelesson',roomController.updateLesson)
router.post('/fetchlessons',roomController.allLessons)
router.post('/fetchlesson',roomController.lessonInd)


//refactors


module.exports = router;