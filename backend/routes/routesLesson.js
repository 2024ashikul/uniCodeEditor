

const express = require('express')
const controllerLesson = require('../controllers/controllerLesson')
const router = express.Router()


router.post('/delete',controllerLesson.delete)
router.post('/fetchone',controllerLesson.fetchone)
router.post('/fetchall',controllerLesson.fetchall)
router.post('/create',controllerLesson.create)
router.post('/update',controllerLesson.update)

module.exports = router;