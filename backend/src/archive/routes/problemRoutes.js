const express = require('express')
const router = express.Router();
const problemController = require('../controllers/problemController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/fetchall',authenticateToken,problemController.fetchAll)
router.post('/fetchall/quiz',authenticateToken,problemController.fetchAllQuiz)
router.post('/fetchone',authenticateToken,problemController.fetchone)
router.post('/create',authenticateToken,problemController.create)
router.post('/delete' ,authenticateToken, problemController.delete)
router.post('/update' ,authenticateToken, problemController.update)
router.post('/fetchone/project' ,authenticateToken, problemController.fetchOneProject)


module.exports = router;