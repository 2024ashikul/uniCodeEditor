
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