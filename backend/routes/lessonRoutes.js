

const express = require('express')
const lessonController = require('../controllers/lessonControllers')
const router = express.Router()

router.post('/delete',lessonController.delete)


module.exports = router;