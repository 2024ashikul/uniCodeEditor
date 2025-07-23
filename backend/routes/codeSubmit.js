const express = require('express')
const { codeSubmit, codeRun, codeRunTemp } = require('../controllers/codeSubmit')
const router = express.Router()

router.post('/runcode',codeRun)
router.post('/submitcode',codeSubmit)


module.exports = router;