const express = require('express');
const { getMeetingStatus } = require('../controllers/meetingController');
const router = express.Router();

router.post('/getmeetingstatus',getMeetingStatus)


module.exports = router;