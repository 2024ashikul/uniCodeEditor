const { access } = require("fs");
const { RoomMembers, User, Meeting } = require("../models");
const { createRoom } = require("../controllers/roomController");
const rooms = {};

async function createMeeting(roomId, userId) {
    const findMeeting = await Meeting.findOne({
        where: {
            roomId: roomId,
            type: 'sharescreen',
            host: userId
        }

    });
    if (findMeeting) {
        return;
    }
    const newMeeting = await Meeting.create({
        roomId: roomId,
        status: 'active',
        type: 'sharescreen',
        host: userId
    });
    return newMeeting;
}

async function getMembers(roomId) {
    const membersfull = await RoomMembers.findAll({
        where: {
            roomId: roomId
        },
        include: [{ model: User, attributes: ['name', 'email', 'id'] }]
    });
    return membersfull.map(item => ({
        role: item.role,
        id: item.user.id,
        name: item.user.name,
        email: item.user.email,
        access: item.role === 'admin' ? true : false,
        active: false
    }));
}

function registerShareScreenHandlers(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        let currentRoomId = null;
        let currentUserId = null;
        socket.on('joinRoom', async ({ roomId, userId }) => {
            console.log(userId);
            await socket.join(roomId);
            socket.to(roomId).emit('sendMessage', `A new member ${userId} joined`)
            console.log(`${socket.id} joined room ${roomId}`);
            currentRoomId = roomId;
            currentUserId = userId;

            if (!rooms[roomId]) {
                const members = await getMembers(roomId);

                rooms[roomId] = { members, screen: '' };
            }
            const member = rooms[roomId].members.find(m => m.id === userId);
            if (member) {
                member.active = true;
            }

            const meetingId = createMeeting(roomId, userId);
            const data = rooms[roomId];
            io.to(roomId).emit('roomData', rooms[roomId]);
            // console.log(rooms[roomId]);
            io.to(roomId).emit('memberJoin', userId);
        });

        socket.on('changeAccess', ({ roomId, userId }) => {
            if (rooms[roomId] && rooms[roomId]) {
                const member = rooms[roomId].members.find(m => m.id === userId);
                if (member) {
                    member.access = !member.access;
                }
            }
            console.log(rooms[roomId])
            const data = rooms[roomId];
            io.to(roomId).emit('roomData', rooms[roomId]);
        });
        console.log(rooms);

        socket.on("screenFrame", ({ roomId, image }) => {
            // forward to everyone else in the room
            socket.to(roomId).emit("screenFrame", { image });
        });

        // socket.on("fileChange", ({ roomId, userId }) => {
        //     if (!rooms[roomId]) return;



        //     socket.to(roomId).emit("fileUpdate", { files : files, userId });
        // });

        // socket.on("showFile", ({ roomId,  userId }) => {
        //     if (rooms[roomId]) {
        //         if (!rooms[roomId].files[userId]) {
        //             rooms[roomId].files[userId] = {};
        //         }

        //     }
        //     console.log(rooms[roomId].files);
        //     const temp = rooms[roomId].files;

        //     socket.emit("seeFile", { files : temp[userId], userId });
        // });

        // socket.on('cursorChange', ({ roomId, cursor }) => {
        //     socket.to(roomId).emit('cursorUpdate', cursor);
        // });
        // socket.on('pointerMove', ({ roomId, pos }) => {
        //     socket.to(roomId).emit('pointerUpdate', pos);
        // });

        socket.on('sendMessage', ({ roomId, message }) => {
            socket.to(roomId).emit('sendMessage', message);
        })

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);

            if (currentRoomId && currentUserId) {
                const member = rooms[currentRoomId]?.members.find(m => m.id === currentUserId);
                if (member) {
                    member.active = false;
                    io.to(currentRoomId).emit('roomData', rooms[currentRoomId]);
                }
            }

        });
    });




}

module.exports = { registerShareScreenHandlers };