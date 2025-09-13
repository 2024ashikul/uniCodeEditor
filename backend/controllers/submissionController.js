const problems = require("../models/problems");
const fs = require('fs').promises;
const { Rooms, RoomMembers, User, Announcement, Assessment, Submission, Problem, Lesson, LessonM, sequelize } = require("../models");
const { Op } = require("sequelize");
const axios = require('axios');
const { timeStamp } = require('console');
const { GoogleGenAI } = require("@google/genai");
const express = require('express');
const multer = require('multer');
const path = require('path');
const { createReadStream } = require('fs');
const unzipper = require('unzipper');


exports.createBulkSubmissions = async (req, res) => {

    const t = await sequelize.transaction();

    try {
        const { assessmentId, answers } = req.body;

        const userId = req.user.userId;
        const submissionsData = [];
        for (const problemId in answers) {
            submissionsData.push({
                problemId: problemId,
                userId: userId,
                assessmentId: assessmentId,
                submittedoption: answers[problemId].type === 'MCQ' ? answers[problemId].answer : null,
                submittedanswer: answers[problemId].type === 'ShortQuestion' ? answers[problemId].answer : null,
            });
        }
        console.log(submissionsData);
        await Submission.bulkCreate(submissionsData, { transaction: t });
        await t.commit();
        res.status(201).json({ message: "Answers submitted successfully!" });

    } catch (error) {

        await t.rollback();
        console.error("Failed to submit answers:", error);
        res.status(500).json({ message: "An error occurred while submitting answers." });
    }
};

exports.resultsForAdmin = async (req, res) => {
    const { assignmentId } = req.body;

    try {
        const assignment = await Assessment.findOne({
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

        const assignment = await Assessment.findOne({
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
    const ext = extensions[language] || 'txt';
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


exports.resultsForAdminQuiz = async (req, res) => {

    const { assessmentId } = req.body;

    try {
        const userId = req.user.userId;
        const assessment = await Assessment.findOne({
            where: {
                id: assessmentId
            }
        });

        const membersfull = await RoomMembers.findAll({
            where: {
                roomId: assessment.roomId
            },
            include: [{ model: User, attributes: ['name', 'email', 'id'] }]
        });

        const members = membersfull.map(item => ({
            name: item.user.name,
            email: item.user.email,
            id: item.user.id
        }))

        const problems = await Problem.findAll({
            where: {
                assessmentId: assessmentId
            }
        });

        let results = await Promise.all(
            members.map(async (member) => {
                let totalscore = 0;
                problems.map(async (problem) => {
                    const submission = await Submission.findOne({
                        where: {
                            userId: member.id,
                            problemId: problem.id
                        }
                    });
                    if (problem.type === "MCQ" && submission) {
                        if (submission.submittedoption == problem.correctAnswer)
                            totalscore += problem.fullmarks;
                    }
                    if (problem.type === "ShortQuestion" && submission) {
                        if (submission.submittedanswer == problem.correctAnswer)
                            totalscore += problem.fullmarks;
                    }

                })

                return { member, totalscore };
            })
        );
        results = results.sort((a, b) => b.totalscore - a.totalscore);
        return res.status(200).json({ results: results });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Interval Server Error' });
    }
}

exports.resultsForUserQuiz = async (req, res) => {

    const { assessmentId } = req.body;

    try {
        const userId = req.user.userId;
        const assessment = await Assessment.findOne({
            where: {
                id: assessmentId
            }
        });

        const membersfull = await RoomMembers.findAll({
            where: {
                roomId: assessment.roomId
            },
            include: [{ model: User, attributes: ['name', 'email', 'id'] }]
        });

        const members = membersfull.map(item => ({
            name: item.user.name,
            email: item.user.email,
            id: item.user.id
        }))

        const problems = await Problem.findAll({
            where: {
                assessmentId: assessmentId
            }
        });



        const ids = problems.map(p => p.id);
        const submissions = await Submission.findAll({
            where: {
                userId: req.user.userId,
                problemId: {
                    [Op.in]: ids
                }
            }
        })


        let results = await Promise.all(
            members.map(async (member) => {
                let totalscore = 0;
                for (const problem of problems) {
                    const submission = await Submission.findOne({
                        where: {
                            userId: member.id,
                            problemId: problem.id,
                        },
                    });

                    if (problem.type === "MCQ" && submission) {
                        if (submission.submittedoption === problem.correctAnswer) {
                            totalscore += problem.fullmarks;
                        }
                    }

                    if (problem.type === "ShortQuestion" && submission) {
                        if (submission.submittedanswer === problem.correctAnswer) {
                            totalscore += problem.fullmarks;
                        }
                    }
                }
                return { member, totalscore };
            })
        );
        results = results.sort((a, b) => b.totalscore - a.totalscore);
        return res.status(200).json({ results: results, problems, submissions });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Interval Server Error' });
    }
}
exports.uploadProject = async (req, res) => {
    // Check if multer processed a file
    // console.log(req);
    console.log(req);
    if (!req.file) {
        console.log("here")
        return res.status(400).json({ message: "No file was uploaded." });
    }

    const tempFilePath = req.file.path;

    try {
        const { problemId, assessmentId } = req.body;
        // Assuming auth middleware adds the user object to the request
        const userId = req.user.userId;

        if (!problemId || !userId) {
            // If validation fails, we must delete the uploaded temp file
            console.log("If validation fails, we must delete the uploaded temp file");
            await fs.unlink(tempFilePath);
            return res.status(400).json({ message: "Missing assessment or student information." });
        }

        // 1. Define final destination folder
        console.log("Step 1");
        const foldername = `${problemId}-${userId}-${Date.now()}`;
        const destinationPath = path.join(process.cwd(), 'uploads', 'submissions', `assessment-${assessmentId}`, foldername);

        // 2. Create the destination directory
        console.log("Step 2");
        await fs.mkdir(destinationPath, { recursive: true });

        // 3. Unzip the file using a stream
        // createReadStream is the most memory-efficient way to handle this
        console.log("Step 3");
        await createReadStream(tempFilePath)
            .pipe(unzipper.Extract({ path: destinationPath }))
            .promise();

        // 4. Delete the temporary .zip file after successful extraction
        console.log("Step 4");
        await fs.unlink(tempFilePath);

        console.log(`Project unzipped to ${destinationPath}`);

        const newSubmission = await Submission.create({
            problemId: problemId,
            userId: userId,
            file: foldername
        })
        // You can now save the `destinationPath` to your database

        res.status(200).json({
            message: 'Project uploaded and extracted successfully!',
            newSubmission
        });

    } catch (err) {
        console.error("Error processing project submission:", err);
        try {
            await fs.unlink(tempFilePath);
        } catch (cleanupErr) {

            console.error('Failed to clean up temporary file:', cleanupErr);
        }

        res.status(500).json({ message: 'Failed to process the uploaded project.' });
    }
};


exports.adminProjectSubmissions = async (req, res) => {
    try {
        const {assessmentId} = req.body;
        const problem = await Problem.findOne({
            where: {
                assessmentId: assessmentId
            }
        })
        let submissions;
        if (problem) {
            const problemId = problem.id;
            submissions = await Submission.findAll({
                where: {
                    problemId: problemId
                },
                attributes: ["createdAt", "id", "time"] ,
                include:{
                    model : User,
                    attributes: ["id", "name", "email"] 
                },
                
            })
        }

        return res.status(200).json(submissions)

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.adminProjectResults = async (req , res) => {
    const { assessmentId } = req.body;

    try {
        const userId = req.user.userId;
        const assessment = await Assessment.findOne({
            where: {
                id: assessmentId
            }
        });

        const membersfull = await RoomMembers.findAll({
            where: {
                roomId: assessment.roomId
            },
            include: [{ model: User, attributes: ['name', 'email', 'id'] }]
        });

        const members = membersfull.map(item => ({
            name: item.user.name,
            email: item.user.email,
            id: item.user.id
        }))

        const problem = await Problem.findOne({
            where: {
                assessmentId: assessmentId
            }
        });

        let results = await Promise.all(
            members.map(async (member) => {
                let totalscore = 0;
                
                    const submission = await Submission.findOne({
                        where: {
                            userId: member.id,
                            problemId: problem.id
                        }
                    });
                    if(submission){
                    submission.totalscore+=submission.FinalScore;
                    }
                return { member, submission };
            })
        );
        results = results.sort((a, b) => b.totalscore - a.totalscore);
        return res.status(200).json({ results: results });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Interval Server Error' });
    }
}