

const express = require('express')
const router = express.Router();
const roomController = require('../controllers/roomController');


router.post('/createroom',roomController.createRoom);
router.post('/joinroom', roomController.joinRoom)
router.post('/loadrooms',roomController.loadRooms)
router.post('/roommembers',roomController.roomMembers)
router.post('/getadmin',roomController.getAdmin)
router.post('/createannoucemnet',roomController.createAnnoucement)
router.post('/fetchannouncements',roomController.fetchAnnoucements)
router.post('/roommembersforassigment',roomController.roomMembersForAssignment)
router.post('/loadroomsjoined',roomController.loadRoomsJoined)
router.post('/getuseraccess',roomController.getUserAccess)

module.exports = router;