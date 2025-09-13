const { Announcement, User } = require("../models");


exports.createAnnoucement = async (req, res) => {
    const { roomId, form, userId } = req.body;
    try {
        const newAnnoucement = await Announcement.create({
            roomId: roomId,
            title: form.title,
            userId: userId,
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
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'profile_pic'] 
                }
            ],
            order: [['createdAt', 'DESC']],

        });
        return res.status(200).json(announcements)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error!' })
    }
}
