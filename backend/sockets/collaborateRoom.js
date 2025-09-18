// server.js (or wherever your socket handlers live)
const { RoomMembers, User, Meeting } = require("../models");

const rooms = {}; // in-memory map for demo; persist in DB for production

async function findMeeting(roomId, userId) {
  return await Meeting.findOne({
    where: { roomId, type: 'collaborateroom' }
  });
}

async function getMembers(roomId) {
  const membersfull = await RoomMembers.findAll({
    where: { roomId },
    include: [{ model: User, attributes: ['name', 'email', 'id'] }]
  });
  return membersfull.map(item => ({
    role: item.role,
    id: String(item.user.id),       
    name: item.user.name,
    email: item.user.email,
    access: true,
    active: false,
  }));
}

function ensureRoomInitialized(roomId, members) {
  if (!rooms[roomId]) {
    rooms[roomId] = { members, history: [], files: {} };
    
    members.forEach(m => {
      const uid = String(m.id);
      
      rooms[roomId].files[uid] = {
        "main.cpp": { language: "cpp", content: "// Start coding..." }
      };
    });
  } else {
    
    members.forEach(m => {
      const uid = String(m.id);
      if (!rooms[roomId].files[uid]) {
        rooms[roomId].files[uid] = {
          "main.cpp": { language: "cpp", content: "// Start coding..." }
        };
      }
    });
  }
  return rooms[roomId].files;
}

function registerCollaborateRoomHandlers(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    let currentRoomId = null;
    let currentUserId = null;

    socket.on('joinRoom', async ({ roomId, userId }) => {
      try {
        const isMeeting = await findMeeting(roomId, userId);
        if (!isMeeting) {
          socket.emit('sendMessage', `Meeting does not exist!`);
          return;
        }

        
        const members = await getMembers(roomId);
        console.log(files);
        if(rooms[roomId].files == {}){
            rooms[roomId].files = ensureRoomInitialized(roomId,members);
        }

        await socket.join(roomId);
        socket.to(roomId).emit('sendMessage', `A new member ${userId} joined`);
        currentRoomId = roomId;
        currentUserId = String(userId);

        
        const member = rooms[roomId].members.find(m => String(m.id) === currentUserId);
        if (member) member.active = true;

        console.log(rooms[roomId] );
        const userFiles = rooms[roomId].files[currentUserId] || {};
        socket.emit('syncFile', { file: userFiles });

        
        io.to(roomId).emit('roomData', {
          members: rooms[roomId].members,
          history: rooms[roomId].history
        });

      } catch (err) {
        console.error('joinRoom error', err);
        socket.emit('sendMessage', 'Internal server error');
      }
    });

    socket.on("fileChange", ({ roomId, files, userId }) => {
      try {
        if (!roomId || !userId) return;
        if (!rooms[roomId]) return;

        const uid = String(userId);
        // protect: clone to avoid accidental shared mutation bugs
        rooms[roomId].files[uid] = JSON.parse(JSON.stringify(files));

        // notify others that this user's files changed
        socket.to(roomId).emit("fileUpdate", { files: rooms[roomId].files[uid], userId: uid });
      } catch (err) {
        console.error('fileChange error', err);
      }
    });

    socket.on("showFile", ({ roomId, userId }) => {
      try {
        const uid = String(userId);
        const userFiles = rooms[roomId]?.files?.[uid] || {};
        // only emit to the requesting socket
        socket.emit("seeFile", { files: userFiles, userId: uid });
      } catch (err) {
        console.error('showFile error', err);
      }
    });

    socket.on('leaveRoom', (roomId) => {
      socket.to(roomId).emit('leaveroom', 'This meeting was Over!');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      if (currentRoomId && currentUserId && rooms[currentRoomId]) {
        const member = rooms[currentRoomId].members.find(m => String(m.id) === currentUserId);
        if (member) {
          member.active = false;
          io.to(currentRoomId).emit('roomData', {
            members: rooms[currentRoomId].members,
            history: rooms[currentRoomId].history
          });
        }
      }
    });

  });
}

module.exports = { registerCollaborateRoomHandlers };
