import { RoomController } from "../controllers/room.controller";
import { authenticateToken } from "../middlewares/authMiddleware";

import { Router } from 'express';
const router = Router();
const roomController = new RoomController();


router.post('/create',authenticateToken,roomController.create);
router.post('/join', authenticateToken,roomController.join)
router.post('/members',authenticateToken,roomController.members)
router.post('/getadmin',authenticateToken,roomController.getAdmin)
router.post('/joined',authenticateToken, roomController.roomsJoined)
router.post('/changeadmin',authenticateToken,roomController.changeAdmin)
router.post('/kickmember',authenticateToken,roomController.kickmember)

export default router;