const { access } = require("fs");

const rooms = {};

function registerCollaborateClassHandlers(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', ({ roomId, username }) => {
      console.log(username);
      socket.join(roomId);
      socket.to(roomId).emit('sendMessage', `A new member ${username} joined`)
      console.log(`${socket.id} joined room ${roomId}`);


      if (!rooms[roomId]) {
        rooms[roomId] = { members: {}, history: [], files: {} };
      }
      if (!rooms[roomId].members[username]) {
        const access = Object.keys(rooms[roomId].members).length === 0
          ? 'true'
          : 'false';
        rooms[roomId].members[username] = { access };
      }

      socket.join(roomId);
      io.emit('roomData', rooms[roomId]);
      console.log(rooms[roomId]);
      io.to(roomId).emit('memberJoin', username);
    });

    socket.on('changeAccess', ({ roomId, member }) => {
      if (rooms[roomId] && rooms[roomId].members[member]) {
        if (rooms[roomId].members[member].access === 'true') {
          rooms[roomId].members[member].access = 'false';
        } else {
          rooms[roomId].members[member].access = 'true'
        }
      }
      console.log(rooms[roomId])
      const data = rooms[roomId];
      io.to(roomId).emit('changeAccess', { data, member });
    });

    socket.on("fileChange", ({ fileName, content, roomId }) => {
      if(!rooms[roomId]) return;
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

    socket.on('fileDelete', ({ roomId, fileToDelete }) => {
      if (roomId && rooms[roomId].files) {
        delete rooms[roomId].files[fileToDelete];
        console.log(rooms[roomId].files);
        socket.to(roomId).emit('fileDelete', fileToDelete);
      }
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
    });
  });


}

module.exports = { registerCollaborateClassHandlers };