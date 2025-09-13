const { where, Op } = require("sequelize");
const { Rooms, RoomMembers, User, Announcement, Assessment, Submission, Problem, Lesson, LessonM, sequelize } = require("../models");
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
            include: [
                {
                    model: Rooms,
                    include: [
                        { model: User, attributes: ['id', 'name', 'profile_pic'] }
                    ]
                }]
        });
        return res.status(201).json({ message: 'Created a new room!', newRoom });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
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
            include: [
                {
                    model: Rooms,
                    include: [
                        { model: User, attributes: ['id', 'name', 'profile_pic'] } // this is the admin
                    ]
                }]
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
            return res.status(200).json({ message: 'Room not found', type: 'warning' })
        }
        const existingRoom = await RoomMembers.findOne({
            where: {
                userId: userId,
                roomId: roomId
            }
        });
        if (existingRoom) {
            return res.status(200).json({ message: 'Room already joined', type: 'warning' })
        }
        const newRoom = await RoomMembers.create({
            userId: userId,
            roomId: roomId,
            role: 'member'
        });

        if (newRoom) {
            return res.status(201).json({ message: 'Joined to the room', newRoom })
        }
        return res.status(400).json({ message: 'Failed to join the room' })
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
            include: [{ model: User, attributes: ['name', 'email', 'id'] }]
        });
        const members = membersfull.map(item => ({
            role: item.role,
            name: item.user.name,
            email: item.user.email,
            userId: item.user.id
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
    const { roomId, userId, assessmentId, problemId } = req.body;
    console.log({ roomId, userId, assessmentId, problemId });

    console.log("Here comes the chekcing");


    try {
        if (!userId) {
            console.log('not allowed as of userId')
            return res.status(403).json({ allowed: false })
        }
        if (roomId) {
            const room = await RoomMembers.findOne({
                where: {
                    roomId: roomId,
                    userId: userId
                }
            })
            if (room) {
                console.log('allowing in room');
                return res.status(200).json({ allowed: true, role: room.role })
            } else {
                console.log('not allowed in room')
                return res.status(403).json({ allowed: false })
            }
        }

        if (assessmentId) {
            const assessment = await Assessment.findOne({ where: { id: assessmentId } });
            const room = await RoomMembers.findOne({
                where: {
                    roomId: assessment.roomId,
                    userId: userId
                }
            })
            if (room) {
                console.log('allowed');
                return res.status(200).json({ allowed: true, 
                    role: room.role,
                    type : assessment.category,
                    scheduleTime : assessment.scheduleTime,
                    duration : assessment.duration,
                    status : assessment.status
                })
            } else {
                console.log('not allowed')
                return res.status(403).json({ allowed: false })
            }
        }

        if (problemId) {
            const problem = await Problem.findOne({ where: { id: problemId } });
            const assessment = await Assessment.findOne({ where: { id: problem.assessmentId } });
            const room = await RoomMembers.findOne({
                where: {
                    roomId: assessment.roomId,
                    userId: userId
                }
            })
            if (room) {
                console.log('allowed');
                return res.status(200).json({ allowed: true, role: room.role })
            } else {
                console.log('not allowed')
                return res.status(403).json({ allowed: false })
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(false)
    }
}


exports.changeAdmin = async (req, res) => {
    try {
        console.log("chainging admin");
        const { roomId, memberToAdmin } = req.body;
        console.log({ roomId, memberToAdmin });
        const member = await RoomMembers.findOne({
            where: {
                roomId: roomId,
                userId: memberToAdmin
            }
        })
        if (member.role == 'admin') {
            member.role = 'member';
        } else {
            member.role = 'admin';
        }
        await member.save();
        return res.status(200).json({ message: 'Permission Updated' })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error!' })
    }
}

exports.kickmember = async (req, res) => {
    try {
        console.log("chainging admin");
        const { roomId, memberToKick } = req.body;
        console.log({ roomId, memberToKick });
        await RoomMembers.destroy({
            where: {
                roomId: roomId,
                userId: memberToKick
            }
        })

        return res.status(200).json({ message: 'Member has been Removed!' })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error!' })
    }
}