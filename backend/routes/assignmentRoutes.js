const express = require('express')
const router = express.Router();
const assignmentController = require('../controllers/assignmentController')

router.post('/addassignment',assignmentController.addAssignment)
router.post('/assignments',assignmentController.fetchAssignments)
router.post('/getsubmissions',assignmentController.fetchSubmissions)
router.post('/fetchproblems',assignmentController.fetchProblems)
router.post('/fetchproblem',assignmentController.fetchProblem)
router.post('/createproblem',assignmentController.createProblem)
router.post('/fetchsubmissionsind',assignmentController.fetchSubmissionsIndividual)
router.post('/fetchassignment',assignmentController.fetchAssignment)
router.post('/scheduleassignments',assignmentController.changeSchedule);
router.post('/scheduleassignmentsuser',assignmentController.fetchAssignmentsUser)

module.exports = router;