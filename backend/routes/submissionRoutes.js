const express = require('express')
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { uploadProjectZip } = require('../middlewares/uploadMiddleware');

router.post('/admin/results',authenticateToken,submissionController.resultsForAdmin)
router.post('/user/results',authenticateToken,submissionController.resultsForUser)
router.post('/admin/fetchall',authenticateToken,submissionController.fetchSubmissionsAdmin)
router.post('/user/fetchall',authenticateToken,submissionController.fetchSubmissionsIndividual)
router.post('/create',authenticateToken,submissionController.submission)

router.post('/bulk',authenticateToken, submissionController.createBulkSubmissions);
router.post('/admin/results/quiz',authenticateToken,submissionController.resultsForAdminQuiz)
router.post('/user/results/quiz',authenticateToken,submissionController.resultsForUserQuiz)

router.post('/user/project/results',authenticateToken,submissionController.userResultProject)
router.post('/upload/project' ,authenticateToken,uploadProjectZip, submissionController.uploadProject)
router.post('/admin/project/submissions' ,authenticateToken, submissionController.adminProjectSubmissions)
router.post('/admin/project/results' ,authenticateToken, submissionController.adminProjectResults)
router.post('/admin/project/savescore' ,authenticateToken, submissionController.ProjectSaveScore)
module.exports = router;