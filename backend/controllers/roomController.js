const { where, Op } = require("sequelize");
const { Rooms, RoomMembers, User, Announcement, Assignment, Submission, Problem, Lesson, LessonM, sequelize } = require("../models");
const roomMember = require("../models/roomMember");
const announcements = require("../models/announcements");
const lesson = require("../models/lesson");
const { group } = require("console");



exports.createRoom = async (req, res) => {
    const { userId, roomName } = req.body;
    console.log(userId)
    try {
        const room = await Rooms.create({
            admin: userId,
            name: roomName
        });
        console.log('hi');
         await RoomMembers.create({
            role: 'admin',
            userId: userId,
            roomId: room.id
        });
        const newRoom = await RoomMembers.findOne({
            where: {
                userId: userId,
                roomId: room.id
            },
            include: {
                model: Rooms
            }
        });
        console.log('Room Created');
        return res.status(201).json({ message: 'Created a new room!', newRoom });
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: 'An error occured'});
    }
}

exports.createAnnoucement = async (req, res) => {
    console.log("annoucements");
    const { roomId, form } = req.body;
    console.log({ roomId, form });
    try {
        const newAnnoucement = await Announcement.create({
            roomId: roomId,
            title: form.title,
            description: form.description
        })
        if (newAnnoucement) {
            return res.status(201).json({ newAnnoucement, message: 'New announcment created!' })
        } else {
            return res.status(201).json({ message: 'An error occured' })
        }
        res.status(201).json(newAnnoucement);
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Could not create an announcement' })
    }
}

exports.fetchAnnoucements = async (req, res) => {
    const { roomId } = req.body;

    try {
        const announcements = await Announcement.findAll({
            where: {
                roomId: roomId
            },
            order: [['createdAt', 'DESC']]
        });
        console.log('fetched announcements')
        res.status(201).json(announcements)
    } catch (err) {
        console.log(err)
    }
}


exports.loadRooms = async (req, res) => {
    const userId = req.body.userId;
    console.log(userId)
    try {
        const room = await Rooms.findAll({
            where: {
                admin: userId
            }
        });
        console.log('loaded rooms');
        return res.status(201).json({ room })
    } catch (err) {
        console.log(err)
    }
}

exports.loadRoomsJoined = async (req, res) => {
    
    const {  userId } = req.body;
    console.log(userId)
    try {
        const rooms = await RoomMembers.findAll({
            where: {
                userId: userId
            },
            include: {
                model: Rooms
            }
        });


        console.log('loaded rooms');
        return res.status(201).json({ rooms })
    } catch (err) {
        console.log(err)
    }
}

exports.joinRoom = async (req, res) => {
    const { userId, roomId } = req.body;
    console.log({ userId, roomId });
    try {
        const room = await Rooms.findOne({
            where: {
                id: roomId
            }
        });
        if (!room) {
            return res.status(404).json({ message: 'Room not found', type: 'warning' })
        }
        const existingRoom = await RoomMembers.findOne({
            where: {
                userId: userId,
                roomId: roomId
            }
        });
        if (existingRoom) {
            return res.status(409).json({ message: 'Room already joined', type: 'warning' })
        }

        const newRoom = await RoomMembers.create({
            userId: userId,
            roomId: roomId,
            role: 'member'
        });

        if (newRoom) {
            return res.status(201).json({ message: 'Joined to the room', type: 'success', newRoom })
        }
        return res.status(201).json({ message: 'Failed to join the room', type: 'success' })
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'An error occured', type: 'error' })
    }
}

exports.roomMembers = async (req, res) => {
    const { roomId } = req.body;
    try {
        const membersfull = await RoomMembers.findAll({
            where: {
                roomId: roomId
            },

            include: [{ model: User, attributes: ['name', 'email'] }]
        });
        const members = membersfull.map(item => ({
            role: item.role,
            name: item.user.name,
            email: item.user.email
        }))
        console.log('loaded roommebers')
        return res.status(201).json(members);
    } catch (err) {
        console.log(err);
    }
}

exports.resultsForAdmin = async (req, res) => {
    const { assignmentId } = req.body;
    const assignment = await Assignment.findOne({
        where: {
            id: assignmentId
        }
    });
    try {
        //getting members
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

        //getting problem ids
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


        return res.status(201).json({ submissions, members, result });
    } catch (err) {
        console.log(err);
    }
}


exports.resultsForUser = async (req, res) => {
    const { assignmentId, userId } = req.body;
    const assignment = await Assignment.findOne({
        where: {
            id: assignmentId
        }
    });
    try {
        //getting members
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

        //getting problem ids
        const problemIds = await Problem.findAll({
            where: {
                assignmentId: assignmentId
            },
            attributes: ['id']
        });
        const ids = problemIds.map(p => p.id);

        // const result = await Submission.findAll({
        //     where: {
        //         problemId: { [Op.in]: ids },
        //         userId: userId
        //     },
        //     attributes: [
        //         'problemId',
        //         [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastCreatedAt']
        //     ],
        //     group: ['problemId']
        // });

        const result = await Promise.all(
            ids.map(async(id)=>{
                const submission = await Submission.findOne({
                    where:{
                        problemId : id,
                        userId : userId
                    },
                    order: [['createdAt', 'DESC']]
                })
                return {id, submission}
            })
        )

        let results = await Promise.all(
            members.map(async (member) => {
                const submissions = await Submission.findAll({
                    where: {
                        problemId: { [Op.in]: ids },
                        userId: member.id
                    },
                    attributes: ['AIscore', 'FinalScore','problemId',
                        [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastCreatedAt']
                    ],
                    group : ['problemId']
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
        console.log(results);



        return res.status(201).json({ results: results, result: result,problemids : ids });
    } catch (err) {
        console.log(err);
    }
}
/*
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
*/


exports.getAdmin = async (req, res) => {
    const { roomId } = req.body;
    try {
        const room = await Rooms.findOne({
            where: {
                id: roomId
            }
        })
        const admin = room.admin;
        const name = room.name;
        console.log('got the admin ')
        return res.status(201).json({ admin, name })

    } catch (err) {
        console.log(err)
    }
}

exports.getUserAccess = async (req, res) => {
    const { roomId, userId, assignmentId, problemId } = req.body;

    console.log({ roomId, userId, assignmentId, problemId });
    try {
        if (!userId) {
            console.log('not allowed')
            return res.status(200).json({ allowed: false })
        }
        if (roomId) {
            const room = await RoomMembers.findOne({
                where: {
                    roomId: roomId,
                    userId: userId
                }
            })
            if (room) {
                console.log('allowed');
                return res.status(200).json({ allowed: true, role: room.role })
            } else {
                return res.status(200).json({ allowed: false })
            }
        }

        if (assignmentId) {
            const assignment = await Assignment.findOne({ where: { id: assignmentId } });
            const room = await RoomMembers.findOne({
                where: {
                    roomId: assignment.roomId,
                    userId: userId
                }
            })
            if (room) {
                console.log('allowed');
                return res.status(200).json({ allowed: true, role: room.role })
            } else {
                console.log('not allowed')
                return res.status(200).json({ allowed: false })
            }
        }

        if (problemId) {
            const problem = await Problem.findOne({ where: { id: problemId } });
            const assignment = await Assignment.findOne({ where: { id: problem.assignmentId } });
            const room = await RoomMembers.findOne({
                where: {
                    roomId: assignment.roomId,
                    userId: userId
                }
            })
            if (room) {
                console.log('allowed');
                return res.status(200).json({ allowed: true, role: room.role })
            } else {
                return res.status(200).json({ allowed: false })
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(200).json(false)
    }
}


exports.createLesson = async (req, res) => {
    try {
        const { contents, title, roomId } = req.body;

        const newLesson = await Lesson.create({
            title: title,
            roomId: roomId
        });

        const newLessonM = new LessonM({
            id: newLesson.id,
            title: title,
            contents: contents
        })
        await newLessonM.save();
        console.log(newLessonM);
        return res.status(201).json({ message: 'Created a new lesson' })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: 'Could not create lesson' })
    }
}

exports.updateLesson = async (req, res) => {
    try {
        const { contents, title, lessonId } = req.body;

        const lesson = await Lesson.findOne({
            where: {
                id: lessonId
            }
        });
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        lesson.title = title || lesson.title;

        await lesson.save();

        const lessonM = await LessonM.findOne({ id: lessonId });

        if (!lessonM) {

            const newLessonM = new LessonM({
                id: lessonId,
                title,
                contents,
            });
            await newLessonM.save();
        } else {
            lessonM.title = title || lessonM.title;
            lessonM.contents = contents || lessonM.contents;
            await lessonM.save();
        }

        return res.status(200).json({ message: "Lesson updated successfully" });

    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: 'Could not create lesson' })
    }
}

exports.lessonInd = async (req, res) => {
    try {
        const { lessonId } = req.body;

        const lesson = await LessonM.findOne({ id: lessonId })

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        console.log(lesson);
        return res.status(201).json({ lesson })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: 'Could not fetch lesson' })
    }
}

exports.allLessons = async (req, res) => {
    try {
        const { roomId } = req.body;

        const lessons = await Lesson.findAll({
            where: { roomId: roomId }
        })

        return res.status(201).json({ message: 'Fetched lessons', lessons })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: 'Could not fetch lesson' })
    }
}