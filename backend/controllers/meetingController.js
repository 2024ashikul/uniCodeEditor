const { RoomMembers, Meeting } = require("../models");


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
        return res.status(201).json({meetings: activeMeetings })
    } catch (err) {
        console.log(err)
    }
}


exports.leaveMeeting = async (req, res) => {
    const { userId } = req.body;
    try {
        const meeting = await Meeting.findOne({
            where: {
                userId: userId
            }
        });
        
        await meeting.destroy();
        
    } catch (err) {
        console.log(err)
    }
}

