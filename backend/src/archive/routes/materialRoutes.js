const express = require('express');

const router = express.Router();

const materialController = require('../controllers/materialController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { uploadRawFiles, uploadMaterialZip, uploadMaterialFile } = require('../middlewares/uploadMiddleware');


router.post('/upload/folder',authenticateToken,uploadMaterialZip,materialController.uploadFolder)
router.post('/upload/file',authenticateToken,uploadMaterialFile,materialController.uploadFile)
router.post('/fetchall',authenticateToken,materialController.fetchall)
router.post('/delete',authenticateToken,materialController.delete)

module.exports = router;

