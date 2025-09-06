const express = require('express')
const router = express.Router();
const assignmentController = require('../controllers/assignmentController')

router.post('/updateassignment',assignmentController.addAssignment)
router.post('/assignments',assignmentController.fetchAssignments)
router.post('/getsubmissions',assignmentController.fetchSubmissions)
router.post('/fetchproblems',assignmentController.fetchProblems)
router.post('/fetchproblem',assignmentController.fetchProblem)
router.post('/createproblem',assignmentController.createProblem)
router.post('/fetchsubmissionsind',assignmentController.fetchSubmissionsIndividual)
router.post('/fetchassignment',assignmentController.fetchAssignment)
router.post('/scheduleassignments',assignmentController.changeSchedule);
router.post('/scheduleassignmentsuser',assignmentController.fetchAssignmentsUser)
router.post('/deleteproblem' , assignmentController.deleteProblem)
router.post('/updateproblem' , assignmentController.updateProblem)
router.post('/publishresults',assignmentController.publishResult)
router.post('/changewhocanseeresults',assignmentController.changeWhoCanSeeResults)


router.post('/create',assignmentController.create);
router.post('/fetchone',assignmentController.fetchone);
router.post('/admin/fetchall',assignmentController.fetchall);
router.post('/user/fetclall',assignmentController.fetchAllUser);
router.post('/changeschedule',assignmentController,assignmentController.changeSchedule)

module.exports = router;