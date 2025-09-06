const express = require('express')
const router = express.Router();
const submissionRoutes = require('../controllers/submissionController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/admin/results',authenticateToken,submissionRoutes.resultsForAdmin)
router.post('/user/results',authenticateToken,submissionRoutes.resultsForUser)
router.post('/admin/fetchall',authenticateToken,submissionRoutes.fetchSubmissionsAdmin)
router.post('/user/fetchall',authenticateToken,submissionRoutes.fetchSubmissionsIndividual)
router.post('/create',authenticateToken,submissionRoutes.submission)

module.exports = router;