const { access } = require("fs");
const { RoomMembers, User, Meeting } = require("../models");
const { createRoom } = require("../controllers/roomController");
const rooms = {};

async function findMeeting(roomId, userId) {
    const findMeeting = await Meeting.findOne({
        where: {
            roomId: roomId,
            type: 'collaborateclassroom',
        }
    });
    return findMeeting;
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

            const isMeeting = await findMeeting(roomId, userId);
            if(!isMeeting) {
                socket.emit('sendMessage', `Meeting does not exist!`)
                return ;
            };

            await socket.join(roomId);
            socket.to(roomId).emit('sendMessage', `A new member ${userId} joined`)
            console.log(`${socket.id} joined room ${roomId}`);
            currentRoomId = roomId;
            currentUserId = userId;
            
    
            if (!rooms[roomId]) {
                const members = await getMembers(roomId);

                rooms[roomId] = { members, history: [], files: { 'main.cpp': {content :'start hee' } }};
            }
            const member = rooms[roomId].members.find(m => m.id === userId);
            if (member) {
                member.active = true;
            }
            socket.emit('syncFile', { file: rooms[roomId].files });

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

        socket.on('fileDelete', ({ roomId, fileToDelete }) => {
            console.log('deleteing file');
            if (!rooms[roomId]) return;
            if (roomId && rooms[roomId].files) {
                delete rooms[roomId].files[fileToDelete];
                console.log(rooms[roomId].files);
                socket.to(roomId).emit('fileDelete', fileToDelete);
            }

        });
        socket.on('fileAdd', ({ roomId, newFileName ,content}) => {
            console.log('adding file');
            if (!rooms[roomId]) return;
            if (roomId && rooms[roomId].files) {
                rooms[roomId].files = {
                    ...rooms[roomId].files,
                    [newFileName]: {
                        content : content
                    }
                };
            }
            socket.to(roomId).emit("fileAdd", { newFileName , content });
        });

        socket.on("fileChange", ({ fileName, content, roomId }) => {
            if (!rooms[roomId]) return;
            rooms[roomId].files = {
                ...rooms[roomId].files,
                [fileName]: {
                    ...(rooms[roomId].files[fileName] || {}),
                    content
                }
            };
            console.log(rooms[roomId].files)
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

        socket.on('leaveRoom', ( roomId ) => {
            const message = 'This meeting was Over!';
            socket.to(roomId).emit('leaveroom',message);
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
            socket.to(currentRoomId).emit('memberJoin', currentUserId)
        });
    });
}

module.exports = { registerCollaborateClassRoomHandlers };