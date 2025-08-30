const { access } = require("fs");
const { RoomMembers, User, Meeting } = require("../models");


const rooms = {};

async function createMeeting(roomId, userId) {
    console.log('creating meeting')
    const findMeeting = await Meeting.findOne({
        where :{
            roomId: roomId,
        type: 'collaborateroom',
        host: userId
        }
        
    });
    if (findMeeting) {
        return;
    }
    const newMeeting = await Meeting.create({
        roomId: roomId,
        status: 'active',
        type: 'collaborateroom',
        host: userId
    });
    return newMeeting.id;
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
        access: true,
        active: false,

    }));
}

function registerCollaborateRoomHandlers(io) {
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


            socket.join(roomId);
            if (!rooms[roomId]) {
                const members = await getMembers(roomId);

                rooms[roomId] = { members, history: [], files :{initial : 'noting'} };
            }
            const member = rooms[roomId].members.find(m => m.id === userId);
            if (member) {
                member.active = true;
            }
            if(rooms[roomId].files[userId]){
                console.log('here');
                socket.emit('syncFile', {file : rooms[roomId].files[userId]});
            }
            const meetingId = createMeeting(roomId, userId);
            const data = rooms[roomId];
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
            const data = rooms[roomId];
            io.to(roomId).emit('roomData', rooms[roomId]);
        });
        console.log(rooms);

        socket.on("fileChange", ({ roomId, files, userId }) => {
            if (!rooms[roomId]) return;
             rooms[roomId].files[userId] = files;
            
            
            socket.to(roomId).emit("fileUpdate", { files : files, userId });
        });

        socket.on("showFile", ({ roomId,  userId }) => {
            if (rooms[roomId]) {
                if (!rooms[roomId].files[userId]) {
                    rooms[roomId].files[userId] = {};
                }
                
            }
            console.log(rooms[roomId].files);
            const temp = rooms[roomId].files;
            
            socket.emit("seeFile", { files : temp[userId], userId });
        });

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

module.exports = { registerCollaborateRoomHandlers };