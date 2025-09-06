const { where, Op } = require("sequelize");
const { Rooms, RoomMembers, User, Announcement, Assignment, Submission, Problem, Lesson, LessonM, sequelize } = require("../models");
const roomMember = require("../models/roomMember");
const announcements = require("../models/announcements");
const lesson = require("../models/lesson");
const { group } = require("console");

exports.create = async (req, res) => {
    const { userId, roomName } = req.body;
    try {
        const room = await Rooms.create({
            admin: userId,
            name: roomName
        });

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
        return res.status(201).json({ message: 'Created a new room!', newRoom });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.createAnnoucement = async (req, res) => {
    const { roomId, form } = req.body;
    try {
        const newAnnoucement = await Announcement.create({
            roomId: roomId,
            title: form.title,
            description: form.description
        })
        if (newAnnoucement) {
            return res.status(201).json({ newAnnoucement, message: 'New announcment created!' })
        }
        return res.status(400).json({ message: 'An error occured' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error!' })
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
        return res.status(200).json(announcements)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error!' })
    }
}



exports.roomsJoined = async (req, res) => {
    const { userId } = req.body;
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
        return res.status(200).json({ rooms })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error!' })
    }
}

exports.join = async (req, res) => {
    const { userId, roomId } = req.body;
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
            return res.status(201).json({ message: 'Joined to the room', newRoom })
        }
        return res.status(401).json({ message: 'Failed to join the room' })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.members = async (req, res) => {
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
        return res.status(200).json(members);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

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
        return res.status(200).json({ admin, name })

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
        return res.status(500).json(false)
    }
}

