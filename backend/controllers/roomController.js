const { where, Op } = require("sequelize");
const { Rooms, RoomMembers, User, Announcement, Assignment, Submission, Problem, Lesson, LessonM } = require("../models");
const roomMember = require("../models/roomMember");
const announcements = require("../models/announcements");
const lesson = require("../models/lesson");



exports.createRoom = async (req, res) => {
    const { userId, roomName } = req.body;
    console.log(userId)
    try {
        const temp = await Rooms.create({
            admin: userId,
            name: roomName
        });
        console.log(temp);
        const roommeber = await RoomMembers.create({
            role: 'admin',
            userId: userId,
            roomId: temp.id
        })
        console.log('Room Created');
        return res.status(201).json({ message: 'Created a new room', id: temp.id });
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: 'An error occured', id: temp.id });
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
        if(newAnnoucement){
            return res.status(201).json({newAnnoucement , message : 'New announcment created!'})
        }else{
            return res.status(201).json({ message : 'An error occured'})
        }
        res.status(201).json(newAnnoucement);
    } catch (err) {
        console.log(err)
        return res.status(400).json({message : 'Could not create an announcement'})
    }
}

exports.fetchAnnoucements = async (req, res) => {
    const { roomId } = req.body;

    try {
        const announcements = await Announcement.findAll({
            where: {
                roomId: roomId
            }
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
    const { userId, type } = req.body;
    console.log(userId)
    try {

        const roommebers = await RoomMembers.findAll({
            where: {
                userId: userId
            },
            include: {
                model: Rooms
            }
        });

        if (type === 'onlyAdmin') {
            const rooms = roommebers.filter(member => member.role === 'admin')
            console.log('loaded rooms for admin');
            return res.status(201).json({ rooms })
        }

        if (type === 'onlyUser') {
            const rooms = roommebers.filter(member => member.role === 'user')
            console.log('loaded rooms for admin');
            return res.status(201).json({ rooms })
        }
        const rooms = roommebers;

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
            return res.status(401).json({ message: 'Room not found', type: 'warning' })
        }
        const existingRoom = await RoomMembers.findOne({
            where: {
                userId: userId,
                roomId: roomId
            }
        });
        if (existingRoom) {
            return res.status(401).json({ message: 'Room already joined', type: 'warning' })
        }

        const newRoom = await RoomMembers.create({
            userId: userId,
            roomId: roomId,
            role: 'user'
        });

        if (newRoom) {
            return res.status(201).json({ message: 'Joined to the room', type: 'success' })
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
            role : item.role,
            name: item.user.name,
            email: item.user.email
        }))
        console.log('loaded roommebers')
        return res.status(201).json(members);
    } catch (err) {
        console.log(err);
    }
}

exports.roomMembersForAssignment = async (req, res) => {
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

        // const result = members.map(item => ({
        //     member: item,
        //     submission: {
        //         submissions.map((item)=> 

        //         )
        //     }
        // }))
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
            return res.status(200).json(false)
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

exports.lessonInd = async (req, res) => {
    try {
        const { lessonId } = req.body;
        
        const lesson = await LessonM.findOne({id : lessonId})

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