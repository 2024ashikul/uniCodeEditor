
const { Assessment, Submission, User, Problem } = require("../models");
const AiPrompt = require('../../ai')
const { Op, where } = require('sequelize');



exports.fetchAll = async (req, res) => {
    const { assessmentId } = req.body;
    try {
        const problems = await Problem.findAll({
            where: {
                assessmentId: assessmentId
            }
        });
        return res.status(200).json(problems)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" });
    }
}

exports.fetchOneProject = async (req, res) => {
    const { assessmentId } = req.body;
    try {
        let problem = [];
        problem = await Problem.findOne({
            where: {
                assessmentId: assessmentId
            }
        });
        if (!problem) {
            return res.status(200).json({ message: 'No problem found' })
        }

        const submission = await Submission.findOne({
            where: {
                problemId: problem.id,
                userId: req.user.userId
            }
        })

        if (problem && submission) {
            const submitted = true;
            return res.status(200).json({ problem, submission, submitted })

        } else {
            return res.status(200).json({ problem, submitted: false })
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" });
    }
}


exports.fetchAllQuiz = async (req, res) => {
    const { assessmentId } = req.body;
    try {

        const problems = await Problem.findAll({
            where: {
                assessmentId: assessmentId
            }
        });
        let submitted = false;

        const ids = problems.map(p => p.id);
        const submissions = await Submission.findAll({
            where: {
                userId: req.user.userId,
                problemId: {
                    [Op.in]: ids
                }
            }
        })
        if (submissions.length > 0) {
            submitted = true;
        }

        return res.status(200).json({ problems, submissions, submitted })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" });
    }
}

exports.create = async (req, res) => {
    const { assessmentId, form, type } = req.body;
    try {
        let newProblem;
        if (type === "MCQ") {
            newProblem = await Problem.create({
                title: form.title,
                type: "MCQ",
                options: form.options,
                fullmarks: form.fullmarks || 1,
                assessmentId: assessmentId,
                correctAnswer: form.correctAnswer
            });
        } else

            if (type == 'ShortQuestion') {
                newProblem = await Problem.create({
                    title: form.title,
                    type: "ShortQuestion",
                    fullmarks: form.fullmarks || 5,
                    assessmentId: assessmentId,
                    correctAnswer: form.correctAnswer
                });
            }

            else {
                newProblem = await Problem.create({
                    title: form.title,
                    statement: form.statement,
                    fullmarks: form.fullmarks || 10,
                    assessmentId: assessmentId
                });
            }

        console.log(newProblem);
        if (newProblem) {
            return res.status(201).json({ newProblem, message: 'New Problem created!' })
        } else {
            return res.status(400).json({ message: 'Could not create problem' })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

exports.update = async (req, res) => {
    const { editProblemId, form, type } = req.body;
    try {
        const problem = await Problem.findOne({
            where: { id: editProblemId }
        });

        if (type === "MCQ") {
            problem.title = form.title;
            problem.options = form.options;
            problem.fullmarks = form.fullmarks || 1;
            problem.correctAnswer = form.correctAnswer

        } else if (type == 'ShortQuestion') {
            problem.title = form.title;
            problem.fullmarks = form.fullmarks || 5;
            problem.correctAnswer = form.correctAnswer
        }

        else {
            problem.title = form.title;
            problem.statement = form.statement;
            problem.fullmarks = form.fullmarks || problem.fullmarks;
            problem.correctAnswer = form.correctAnswer;
        }
        await problem.save();

        if (problem) {
            return res.status(201).json({ problem, message: 'Problem updated' })
        } else {
            return res.status(404).json({ message: 'Could not update Problem' })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

exports.delete = async (req, res) => {
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


exports.fetchone = async (req, res) => {
    const { problemId } = req.body;
    try {
        const problem = await Problem.findOne({
            where: {
                id: problemId
            }
        });
        if (problem) {
            return res.status(200).json(problem)
        } else {
            console.log("error")
            return res.status(404).json({ message: 'Problem not found!' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'could not perform the action' })
    }
}