
const { Assignment, Submission, User, Problem } = require("../models");
const AiPrompt = require('../ai')
const { Op, where } = require('sequelize');

exports.create = async (req, res) => {
    const { roomId, form, assignmentId } = req.body;

    try {
        if (assignmentId) {
            const existingAssignment = await Assignment.findOne({
                where: { id: assignmentId }
            });
            existingAssignment.title = form.title;
            existingAssignment.description = form.description;
            await existingAssignment.save();
            const updatedAssignment = existingAssignment;
            if (existingAssignment) {
                return res.status(201).json({ updatedAssignment, message: 'Assingment updated successfully' });
            }
            else {
                return res.status(404).json({ message: 'Assingment not found' });
            }
        }
        const newAssignment = await Assignment.create({
            roomId: roomId,
            title: form.title,
            description: form.description
        })
        if (newAssignment) {
            return res.status(201).json({ newAssignment, message: 'Assingment created successfully' });
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.fetchone = async (req, res) => {
    const { assignmentId } = req.body;
    try {
        const assingment = await Assignment.findOne({
            where: { id: assignmentId }
        })
        return res.status(200).json(assingment);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.fetchall = async (req, res) => {
    const { roomId } = req.body;
    try {
        const assignments = await Assignment.findAll({
            where: {
                roomId: roomId
            }
        });
        return res.status(200).json(assignments);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.fetchAllUser = async (req, res) => {
    const { roomId } = req.body;
    try {
        const assignments = await Assignment.findAll({
            where: {
                roomId: roomId,
                status: 'assigned'
            }
        });
        return res.status(200).json(assignments)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.changeSchedule = async (req, res) => {

    try {
        const { assignmentId, form } = req.body;
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
        return res.status(200).json(assignment)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Server Error' });
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
        return res.status(201).json(problems)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

exports.createProblem = async (req, res) => {
    const { assignmentId, form } = req.body;
    try {
        const newProblem = await Problem.create({
            title: form.title,
            statement: form.statement,
            fullmarks: form.fullmarks || 10,
            assignmentId: assignmentId
        });
        if (newProblem) {
            console.log('New problem created')
            return res.status(201).json({ newProblem, message: 'New Problem created!' })
        } else {
            return res.status(400).json({ message: 'Could not create problem' })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error", error: err.message });
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
        problem.fullmarks = form.fullmarks || problem.fullmarks;
        await problem.save();
        console.log(temp);
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

exports.publishResult = async (req, res) => {
    const { assignmentId } = req.body;
    console.log('publish result')
    try {
        const findAssignment = await Assignment.findOne({
            where: { id: assignmentId }
        })
        findAssignment.resultpublished = true;
        await findAssignment.save();
        return res.status(201).json({ message: 'Result Published successfully', type: 'success' });
    } catch (err) {
        console.log(err)
        return res.status(201).json({ message: 'Could not return the result', type: 'error' });
    }
}

exports.changeWhoCanSeeResults = async (req, res) => {
    const { assignmentId } = req.body;
    console.log('change publish result')
    try {
        const findAssignment = await Assignment.findOne({
            where: { id: assignmentId }
        })
        findAssignment.everyoneseesresults = !findAssignment.everyoneseesresults;
        await findAssignment.save();
        return res.status(201).json({ message: 'Result Published successfully', type: 'success' });
    } catch (err) {
        console.log(err)
        return res.status(201).json({ message: 'Could not return the result', type: 'error' });
    }

}