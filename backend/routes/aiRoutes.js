const express = require('express')
const router = express.Router();
const aiController = require('../controllers/aiControllers')

router.post('/generate',aiController.generate)
router.post('/generate/problem',aiController.generateProblem)
router.post('/generate/lesson', aiController.generateLesson)
module.exports = router;