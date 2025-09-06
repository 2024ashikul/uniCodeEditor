const express = require('express')
const router = express.Router();
const problemController = require('../controllers/problemController')

router.post('/fetchall',problemController.fetchAll)
router.post('/fetchone',problemController.fetchone)
router.post('/create',problemController.create)
router.post('/delete' , problemController.delete)
router.post('/update' , problemController.update)

module.exports = router;