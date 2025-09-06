const problems = require("../models/problems");
const fs = require('fs').promises;
const path = require('path')
const { Rooms, RoomMembers, User, Announcement, Assignment, Submission, Problem, Lesson, LessonM, sequelize } = require("../models");
const { Op } = require("sequelize");
const axios = require('axios');
const { timeStamp } = require('console');
const { GoogleGenAI } = require("@google/genai");


exports.resultsForAdmin = async (req, res) => {
    const { assignmentId } = req.body;

    try {
        const assignment = await Assignment.findOne({
            where: {
                id: assignmentId
            }
        });

        const membersfull = await RoomMembers.findAll({
            where: {
                roomId: assignment.roomId
            },
            include: [{ model: User, attributes: ['name', 'email', 'id'] }]
        });

        const members = membersfull.map(item => ({
            name: item.user.name,
            email: item.user.email,
            id: item.user.id
        }))
        const memberids = members.map(item => item.id)


        const problemIds = await Problem.findAll({
            where: {
                assignmentId: assignmentId
            },
            attributes: ['id']
        });
        const ids = problemIds.map(p => p.id);

        const submissions = await Submission.findAll({
            where: {
                problemId: {
                    [Op.in]: ids
                },
                userId: {
                    [Op.in]: memberids
                }
            },
            include: {
                model: User,
                attributes: ['id', 'email', 'name']
            }
        });


        const result = members.map((element) => ({
            member: element,
            submission:
                problemIds.map(problem => (
                    submissions.filter(item => (item.userId === element.id && item.problemId == problem.id || NaN)
                    ))
                )
        }));

        return res.status(200).json({ submissions, members, result });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Interval Server Error' });
    }
}


exports.resultsForUser = async (req, res) => {
    const { assignmentId, userId } = req.body;

    try {

        const assignment = await Assignment.findOne({
            where: {
                id: assignmentId
            }
        });

        const membersfull = await RoomMembers.findAll({
            where: {
                roomId: assignment.roomId
            },
            include: [{ model: User, attributes: ['name', 'email', 'id'] }]
        });

        const members = membersfull.map(item => ({
            name: item.user.name,
            email: item.user.email,
            id: item.user.id
        }))


        const problemIds = await Problem.findAll({
            where: {
                assignmentId: assignmentId
            },
            attributes: ['id']
        });
        const ids = problemIds.map(p => p.id);

        const result = await Promise.all(
            ids.map(async (id) => {
                const submission = await Submission.findOne({
                    where: {
                        problemId: id,
                        userId: userId
                    },
                    order: [['createdAt', 'DESC']]
                })
                return { id, submission }
            })
        )

        let results = await Promise.all(
            members.map(async (member) => {
                const submissions = await Submission.findAll({
                    where: {
                        problemId: { [Op.in]: ids },
                        userId: member.id
                    },
                    attributes: ['AIscore', 'FinalScore', 'problemId',
                        [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastCreatedAt']
                    ],
                    group: ['problemId']
                });

                let totalscore = 0;
                submissions.forEach((submission) => {
                    if (submission.FinalScore) {
                        totalscore += submission.FinalScore || 0;
                    } else {
                        totalscore += submission.AIscore || 0;
                    }
                });

                return { member, totalscore };
            })
        );
        results = results.sort((a, b) => b.totalscore - a.totalscore);
        return res.status(200).json({ results: results, result: result, problemids: ids });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Interval Server Error' });
    }
}

exports.fetchSubmissionsAdmin = async (req, res) => {
    const { assignmentId } = req.body;
    try {
        const problemIds = await Problem.findAll({
            where: {
                assignmentId: assignmentId
            },
            attributes: ['id']
        });
        const ids = problemIds.map(p => p.id);

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

        return res.status(200).json(submissions)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Interval Server Error' });
    }
}

exports.fetchSubmissionsIndividual = async (req, res) => {
    const { assignmentId, userId } = req.body;
    try {
        const problemIds = await Problem.findAll({
            where: {
                assignmentId: assignmentId
            },
            attributes: ['id']
        });
        const ids = problemIds.map(p => p.id);
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
        return res.status(200).json(submissions)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Interval Server Error' });
    }
}

exports.submission = async (req, res) => {
    const extensions = {
        cpp: 'cpp',
        c: 'c',
        javascript: 'js',
        python: 'py',
        java: 'java',
        csharp: 'cs'
    }
    console.log("submititng");
    const { code, language, problemId, userId } = req.body;
    const ext = extensions[language];
    const time = Date.now();
    const timestamp = time.toString();

    const filesDir = path.join(__dirname, '..', 'files');
    const filePath = path.join(filesDir, `${timestamp}.${ext}`);
    const txtPath = path.join(filesDir, `${timestamp}.txt`);
    try {
        await fs.mkdir(filesDir, { recursive: true });

        // Now, write the files safely
        await Promise.all([
            fs.writeFile(filePath, code),
            fs.writeFile(txtPath, code)
        ]);


        const newSubmission = await Submission.create({
            file: timestamp,
            ext: ext,
            problemId: problemId,
            userId: userId,
            time: Date.now()
        });

        const problem = await Problem.findOne({
            where: { id: problemId }
        })
        const statement = problem.statement;
        console.log(statement)
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `
            You are an AI evaluator.

            Task:
            - The user has submitted code for a programming problem.
            - Evaluate the submission out of 9.
            - Use partial marks if necessary (e.g., 5, 7, etc.)
            - 3 marks for logic, 3 marks for syntax, 3 marks for overall coding
            Important:
            - Output ONLY the score as a single digit (0-9).
            - DO NOT explain or output anything else.

            Problem:
            ${statement}

            Code:
            ${code}
            Language : 
            ${language}
        `;
        let score = 4;
        async function main() {
            const response = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: [{ parts: [{ text: prompt }] }]
            });
            console.log(`response is ${response.text}`);
            score = response.text;
        }
        try {
            await main();
            newSubmission.AIscore = score;
            await newSubmission.save();

        } catch (err) {
            console.log(err);
            console.log("could not");
        }

        if (newSubmission) {
            return res.status(201).json({ message: 'Submitted successfully!!!' })
        } else {
            return res.status(400).json({ message: 'Submission Failed!' })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' })
    }
}