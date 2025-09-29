const { RoomMembers, Meeting } = require("../models");
const { where } = require("../models/lessons");
const redisClient = require("../../RedisServices/redisClient");


exports.getMeetingStatus = async (req, res) => {
    const { userId } = req.body;
    try {
        const roommembers = await RoomMembers.findAll({
            where: {
                userId: userId
            },
            attributes: ['roomId']
        });
        const rooms = roommembers.map(member => member.roomId);
        const activeMeetings = await Meeting.findAll({
            where: {
                roomId: rooms,
                status: 'active'
            }
        });
        console.log('here in meeting controller')
        return res.status(201).json({ meetings: activeMeetings })
    } catch (err) {
        console.log(err)
    }
}

exports.getMeetingUser = async (req, res) => {
    const { roomId } = req.body;
    try {

        const activeMeetings = await Meeting.findAll({
            where: {
                roomId: roomId,
                status: 'active'
            }
        });
        return res.status(201).json({ meetings: activeMeetings })
    } catch (err) {
        console.log(err)
    }
}

exports.getMeetingStatusRoom = async (req, res) => {
    const { roomId } = req.body;
    try {
        const activeCollaborateClassRoom = await Meeting.findOne({
            where: {
                roomId: roomId,
                status: 'active',
                type: 'collaborateclassroom'
            }
        });
        const activeCollaborateRoom = await Meeting.findOne({
            where: {
                roomId: roomId,
                status: 'active',
                type: 'collaborateroom'
            }
        });
        console.log('here in meeting controller')
        return res.status(200).json({ activeCollaborateClassRoom, activeCollaborateRoom })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Server Error!' })
    }
}


exports.leave = async (req, res) => {
    const { roomId, type } = req.body;
    try {
        const meeting = await Meeting.findOne({
            where: {
                roomId: roomId,
                type: type,
                status: 'active'
            }
        });

        if (!meeting) {
            return res.status(200).json({ message: 'Meeting not found!' })
        }
        meeting.status = 'ended';
        await meeting.save();
        return res.status(200).json({ message: 'Ended the meeting successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Server Error!' })
    }
}


exports.create = async (req, res) => {
    try {
        const { roomId, userId, type } = req.body;
        const meeting = await Meeting.findOne({
            where: {
                roomId: roomId,
                status: 'active',
                type: type,
                host: userId
            }
        })

        if (meeting) {
            console.log('exists');
            return res.status(200).json({ message: 'Meeting already exists!' })
        }

        const newMeeting = await Meeting.create({
            roomId: roomId,
            status: 'active',
            type: type,
            host: userId
        });

        
        await redisClient.set(`Room:${newMeeting.type}-${roomId}`, JSON.stringify(newMeeting));
        
        if (newMeeting) {
            return res.status(201).json({ message: 'New meeting created' })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error!' })
    }
}