const { Assignment, Submission, User, Problem } = require("../models");

const { Op, where } = require('sequelize');

exports.addAssignment = async (req, res) => {
    const { roomId, form } = req.body;
    console.log({ roomId, form });
    try {
        const newAssignment = await Assignment.create({
            roomId: roomId,
            title: form.title,
            description: form.description
        })
        res.status(201).json(newAssignment);
    } catch (err) {
        console.log(err)
    }
}

exports.fetchAssignment = async (req, res) => {
    const { assignmentId } = req.body;
    console.log('fetchingassignemnts')
    try {
        const FindAssignment = await Assignment.findOne({
            where: { id: assignmentId }
        })
        res.status(201).json(FindAssignment);
    } catch (err) {
        console.log(err)
    }
}

exports.fetchAssignments = async (req, res) => {
    const { roomId } = req.body;
    try {
        const assignments = await Assignment.findAll({
            where: {
                roomId: roomId
            }
        });
        console.log('fetchedassignments')
        res.status(201).json(assignments)
    } catch (err) {
        console.log(err)
    }
}

exports.fetchAssignmentsUser = async (req, res) => {
    const { roomId } = req.body;
    try {
        const assignments = await Assignment.findAll({
            where: {
                roomId: roomId,
                status: 'assigned'
            }
        });
        console.log('fetchedassignments for user')
        res.status(201).json(assignments)
    } catch (err) {
        console.log(err)
    }
}

exports.changeSchedule = async (req, res) => {
    const { assignmentId, form } = req.body;
    console.log({ assignmentId, form  });
    try {
        const assignment = await Assignment.findOne({
            where: {
                id: assignmentId
            }
        });

        if (form.assigned =='false') {
            assignment.scheduleTime = null;
            assignment.status = 'not assigned';
            assignment.duration = null;
        } else {
            let datetime = form.datetime;
            datetime= datetime.slice(0, 16);
            assignment.scheduleTime = datetime;
            assignment.status = 'assigned';
            assignment.duration =form.duration;
        }
        await assignment.save();
        return res.status(201).json(assignment)
    } catch (err) {
        console.log(err)
    }
}

exports.fetchProblems = async (req, res) => {
    const { assignmentId } = req.body;
    try {
        const problems = await Problem.findAll({
            where: {
                assignmentId: assignmentId
            }
        });
        console.log('fetched prolbems')
        res.status(201).json(problems)
    } catch (err) {
        console.log(err)
    }
}

exports.createProblem = async (req, res) => {
    const { assignmentId, form } = req.body;
    try {
        const newProblem = await Problem.create({
            title: form.title,
            statement: form.statement,
            assignmentId: assignmentId
        });
        if (newProblem) {
            console.log('New problem created')
            return res.status(201).json(newProblem)
        } else {
            console.log("error")
        }
    } catch (err) {
        console.log(err)
    }

}


exports.fetchProblem = async (req, res) => {
    const { problemId } = req.body;
    try {
        const problem = await Problem.findOne({
            where: {
                id: problemId
            }
        });
        if (problem) {
            console.log('fetched problems')
            return res.status(201).json(problem)
        } else {
            console.log("error")
        }

    } catch (err) {
        console.log(err)
    }
}

exports.fetchSubmissions = async (req, res) => {
    console.log('here')
    const { assignmentId } = req.body;
    console.log('here')
    try {
        const problemIds = await Problem.findAll({
            where: {
                assignmentId: assignmentId
            },
            attributes: ['id']
        });
        const ids = problemIds.map(p => p.id);
        console.log(ids);
        const submissions = await Submission.findAll({
            where: {
                problemId: {
                    [Op.in]: ids
                }
            },
            include: {
                model: User,
                attributes: ['id', 'email', 'name']
            }
        });
        console.log('fetched sumissions');
        res.status(201).json(submissions)
    } catch (err) {
        console.log(err);
    }
}

exports.fetchSubmissionsIndividual = async (req, res) => {
    console.log('here')
    const { assignmentId, userId } = req.body;
    console.log('here')
    try {
        const problemIds = await Problem.findAll({
            where: {
                assignmentId: assignmentId
            },
            attributes: ['id']
        });
        const ids = problemIds.map(p => p.id);
        console.log(ids);
        const submissions = await Submission.findAll({
            where: {
                problemId: {
                    [Op.in]: ids
                },
                userId : userId
            },
            include: {
                model: User,
                attributes: ['id', 'email', 'name']
            }
        });
        console.log('fetched sumissions for user');
        res.status(201).json(submissions)
    } catch (err) {
        console.log(err);
    }
}