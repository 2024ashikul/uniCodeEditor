const { Assignment, Submission, User, Problem } = require("../models");

const { Op, where } = require('sequelize');

exports.addAssignment = async (req, res) => {
    const { roomId, form, assignmentId } = req.body;
    console.log({ roomId, form,assignmentId });
    try {

        if (assignmentId) {
            const existingAssignment = await Assignment.findOne({
                where : {id: assignmentId}
            });
            existingAssignment.title = form.title;
            existingAssignment.description = form.description;
            await existingAssignment.save();
            const updatedAssignment = existingAssignment;
            if(existingAssignment){
                return res.status(201).json({updatedAssignment , message : 'Assingment updated successfully'});
            }
            else{
                return res.status(404).json({ message : 'Assingment not found'});
            }

        }
        const newAssignment = await Assignment.create({
            roomId: roomId,
            title: form.title,
            description: form.description
        })
        if(newAssignment){
            return res.status(201).json({newAssignment , message : 'Assingment created successfully'});
        }
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
    console.log({ assignmentId, form });
    try {
        const assignment = await Assignment.findOne({
            where: {
                id: assignmentId
            }
        });

        if (form.assigned == 'false') {
            assignment.scheduleTime = null;
            assignment.status = 'not assigned';
            assignment.duration = null;
        } else {
            let datetime = form.datetime;
            datetime = datetime.slice(0, 16);
            assignment.scheduleTime = datetime;
            assignment.status = 'assigned';
            assignment.duration = form.duration;
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

exports.updateProblem = async (req, res) => {
    const { editProblemId, form } = req.body;
    try {
        const problem = await Problem.findOne({
            where: { id: editProblemId }
        });
        problem.title = form.title;
        problem.statement = form.statement;
        await problem.save();
        if (problem) {
            console.log('Problem Updated')
            return res.status(201).json({ problem, message: 'Problem updated' })
        } else {
            console.log("error")
            return res.status(404).json({ message: 'Could not update Problem' })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' })
    }

}

exports.deleteProblem = async (req, res) => {
    const { problemId } = req.body;
    try {
        const deletedCount = await Problem.destroy({
            where: { id: problemId }
        });

        if (deletedCount > 0) {
            return res.status(200).json({ message: 'Problem deleted' });
        } else {
            return res.status(404).json({ message: 'Problem not found or already deleted' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'could not perform the action' })
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
                userId: userId
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