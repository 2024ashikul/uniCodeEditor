


function registerSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log("socket connectoed", socket.id);

        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            const msgData = {
                message: 'A user has joined the room',
                sender: 'system',
                roomId: roomId
            }
            socket.to(roomId).emit('receive-message', msgData);
            // socket.to(roomId).emit('system_message',{
            //     message : 'A user has joined the room'
            // })
        })

        socket.on('send-message', ({ roomId, message, sender }) => {

            const msgData = {
                message,
                roomId: roomId,
                sender: sender
            }
            console.log(msgData);
            io.to(roomId).emit('receive-message', msgData);
            console.log('succefuul');
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });

        socket.on('leave', (roomId) => {
            socket.leave(roomId);
            const msgData = {
                message: 'A user has left the room',
                sender: 'system',
                roomId: roomId
            }
            socket.to(roomId).emit('receive-message',msgData)
            
        })


    });

}

module.exports = { registerSocketHandlers};