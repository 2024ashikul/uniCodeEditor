const express = require('express')
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/admin/results',authenticateToken,submissionController.resultsForAdmin)
router.post('/user/results',authenticateToken,submissionController.resultsForUser)
router.post('/admin/fetchall',authenticateToken,submissionController.fetchSubmissionsAdmin)
router.post('/user/fetchall',authenticateToken,submissionController.fetchSubmissionsIndividual)
router.post('/create',authenticateToken,submissionController.submission)
router.post('/bulk',authenticateToken, submissionController.createBulkSubmissions);
router.post('/admin/results/quiz',authenticateToken,submissionController.resultsForAdminQuiz)
router.post('/user/results/quiz',authenticateToken,submissionController.resultsForUserQuiz)

module.exports = router;