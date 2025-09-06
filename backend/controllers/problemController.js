
const { Assignment, Submission, User, Problem } = require("../models");
const AiPrompt = require('../ai')
const { Op, where } = require('sequelize');


exports.fetchAll = async (req, res) => {
    const { assignmentId } = req.body;
    try {
        const problems = await Problem.findAll({
            where: {
                assignmentId: assignmentId
            }
        });        
        return res.status(200).json(problems)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error"});
    }
}

exports.create = async (req, res) => {
    const { assignmentId, form } = req.body;
    try {
        const newProblem = await Problem.create({
            title: form.title,
            statement: form.statement,
            fullmarks: form.fullmarks || 10,
            assignmentId: assignmentId
        });
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
    const { editProblemId, form } = req.body;
    try {
        const problem = await Problem.findOne({
            where: { id: editProblemId }
        });
        
        problem.title = form.title;
        problem.statement = form.statement;
        problem.fullmarks = form.fullmarks || problem.fullmarks;
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
            return res.status(201).json(problem)
        } else {
            console.log("error")
            return res.status(404).json({ message: 'Problem not found!' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'could not perform the action' })
    }
}