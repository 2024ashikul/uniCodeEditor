const { Assessment, Submission, User, Problem, Announcement } = require("../models");
const AiPrompt = require('../ai');
const { Op, where } = require('sequelize');

exports.create = async (req, res) => {
    const { roomId, userId, form, assessmentId } = req.body;
    try {
        if (assessmentId) {
            const existingAssessment = await Assessment.findOne({
                where: { id: assessmentId }
            });
            existingAssessment.title = form.title;
            existingAssessment.description = form.description;
            await existingAssessment.save();
            const updatedAssessment = existingAssessment;
            if (existingAssessment) {
                return res.status(201).json({ updatedAssessment, message: 'Assessment updated successfully' });
            } else {
                return res.status(404).json({ message: 'Assessment not found' });
            }
        }
        const newAssessment = await Assessment.create({
            roomId: roomId,
            title: form.title,
            description: form.description,
            category: form.category,
            userId: userId
        });

        if (newAssessment) {
            return res.status(201).json({ newAssessment, message: 'Assessment created successfully' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.fetchone = async (req, res) => {
    const { assessmentId } = req.body;
    try {
        const assessment = await Assessment.findOne({
            where: { id: assessmentId }
        });
        return res.status(200).json(assessment);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.fetchall = async (req, res) => {
    const { roomId } = req.body;
    try {
        const assessments = await Assessment.findAll({
            where: {
                roomId: roomId
            }
        });
        return res.status(200).json(assessments);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.fetchAllUser = async (req, res) => {
    const { roomId } = req.body;
    try {
        const assessments = await Assessment.findAll({
            where: {
                roomId: roomId,
                status: 'assigned'
            }
        });
        return res.status(200).json(assessments);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.changeSchedule = async (req, res) => {
    try {
        const { assessmentId, form, userId } = req.body;
        const assessment = await Assessment.findOne({
            where: {
                id: assessmentId
            }
        });


        assessment.scheduleTime = new Date(form.datetime);
        assessment.status = 'assigned';
        assessment.duration = parseInt(form.duration, 10);
        assessment.assigned = form.assigned;
        await assessment.save();

        if (assessment.assigned) {
            const title = `New ${assessment.category} ${assessment.title} assigned!`;
            await Announcement.create({
                roomId: assessment.roomId,
                title: title,
                userId: userId,
                description: `The ${assessment.category} is scheduled for ${assessment.scheduleTime} and its duration is ${assessment.duration} mins`,
                category: assessment.category
            });
        }


        return res.status(200).json(assessment);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.publishResult = async (req, res) => {
    const { assessmentId } = req.body;
    try {
        const findAssessment = await Assessment.findOne({
            where: { id: assessmentId }
        });
        findAssessment.resultpublished = true;
        await findAssessment.save();
        return res.status(201).json({ message: 'Result Published successfully', type: 'success' });
    } catch (err) {
        console.log(err);
        return res.status(201).json({ message: 'Could not return the result', type: 'error' });
    }
};

exports.changeWhoCanSeeResults = async (req, res) => {
    const { assessmentId } = req.body;
    try {
        const findAssessment = await Assessment.findOne({
            where: { id: assessmentId }
    });
        findAssessment.everyoneseesresults = !findAssessment.everyoneseesresults;
        await findAssessment.save();
        return res.status(201).json({ message: 'Result Published successfully', type: 'success' });
    } catch (err) {
        console.log(err);
        return res.status(201).json({ message: 'Could not return the result', type: 'error' });
    }
};

exports.updateSettings = async (req, res) => {
    const { assessmentId, userId, ...settingsPayload } = req.body;

    if (!assessmentId) {
        return res.status(400).json({ message: 'Assessment ID is required' });
    }

    try {
        const assessment = await Assessment.findOne({ where: { id: assessmentId } });

        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        const wasDraft = assessment.status === 'Draft';
        const isNowPublished = settingsPayload.status === 'Published';

        Object.keys(settingsPayload).forEach(key => {
            if (assessment[key] !== undefined) {
                assessment[key] = settingsPayload[key];
            }
        });

        await assessment.save();

        if (wasDraft && isNowPublished && userId) {
            await Announcement.create({
                roomId: assessment.roomId,
                title: `New Assessment Published: ${assessment.title}`,
                userId: userId,
                description: 'A new assessment is now available.',
                category: 'Assessment'
            });
        }

        return res.status(200).json({ message: 'Settings updated successfully', assessment });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};