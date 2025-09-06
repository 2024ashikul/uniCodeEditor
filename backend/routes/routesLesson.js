

const express = require('express')
const controllerLesson = require('../controllers/controllerLesson')
const { authenticateToken } = require('../middlewares/authMiddleware')
const router = express.Router()


router.post('/delete',authenticateToken,controllerLesson.delete)
router.post('/fetchone',authenticateToken,controllerLesson.fetchone)
router.post('/fetchall',authenticateToken,controllerLesson.fetchall)
router.post('/create',authenticateToken,controllerLesson.create)
router.post('/update',authenticateToken,controllerLesson.update)

module.exports = router;