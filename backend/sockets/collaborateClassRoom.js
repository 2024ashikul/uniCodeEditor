const { access } = require("fs");
const { RoomMembers, User, Meeting } = require("../models");
const { createRoom } = require("../controllers/roomController");
const rooms = {};

async function createMeeting(roomId, userId) {
    const findMeeting = await Meeting.findOne({
        where: {
            roomId: roomId,
            type: 'collaborateclassroom',
            host: userId
        }

    });
    if (findMeeting) {
        return;
    }
    const newMeeting = await Meeting.create({
        roomId: roomId,
        status: 'active',
        type: 'collaborateclassroom',
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

function registerCollaborateClassRoomHandlers(io) {
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
            await createMeeting(roomId, userId);


            await socket.join(roomId);
            if (!rooms[roomId]) {
                const members = await getMembers(roomId);

                rooms[roomId] = { members, history: [] };
            }
            const member = rooms[roomId].members.find(m => m.id === userId);
            if (member) {
                member.active = true;
            }

            io.to(roomId).emit('roomData', rooms[roomId]);
            console.log(rooms[roomId]);
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
        
            io.to(roomId).emit('roomData', rooms[roomId]);
        });

        socket.on("fileChange", ({ fileName, content, roomId }) => {
            socket.to(roomId).emit("fileUpdate", { fileName, content });
        });

        socket.on('cursorChange', ({ roomId, cursor }) => {
            socket.to(roomId).emit('cursorUpdate', cursor);
        });
        socket.on('pointerMove', ({ roomId, pos }) => {
            socket.to(roomId).emit('pointerUpdate', pos);
        });

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

module.exports = { registerCollaborateClassRoomHandlers };