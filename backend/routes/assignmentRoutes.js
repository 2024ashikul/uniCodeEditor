const express = require('express')
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/admin/schedule',authenticateToken,assignmentController.changeSchedule);
router.post('/admin/publishresults',authenticateToken,assignmentController.publishResult)
router.post('/admin/changewhocanseeresults',authenticateToken,assignmentController.changeWhoCanSeeResults)
router.post('/create',authenticateToken,assignmentController.create);
router.post('/fetchone',authenticateToken,assignmentController.fetchone);
router.post('/admin/fetchall',authenticateToken,assignmentController.fetchall);
router.post('/user/fetchall',authenticateToken,assignmentController.fetchAllUser);
router.post('/changeschedule',authenticateToken,assignmentController.changeSchedule)

module.exports = router;