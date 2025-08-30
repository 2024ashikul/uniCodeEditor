const { createServer } = require('http')
const { Server } = require('socket.io')
const { sequelize } = require('./models');
const app = require('./app');

const httpServer = createServer(app);
const mongoose = require('mongoose')
const {registerCollaborateHandlers} = require('./sockets/collaborate')
const {registerCollaborateRoomHandlers} =require('./sockets/collaborateRoom');
const { registerCollaborateClassRoomHandlers } = require('./sockets/collaborateClassRoom');
const { registerCollaborateClassHandlers } = require('./sockets/collaborateClass');

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


const collaborate = io.of('/collaborate');
const collaborateClass = io.of('/collaborateClass');
const collaborateClassRoom = io.of('/collaborateClassRoom')
const collaborateRoom = io.of('/collaborateRoom')

registerCollaborateClassHandlers(collaborateClass);
registerCollaborateHandlers(collaborate);
registerCollaborateClassRoomHandlers(collaborateClassRoom);
registerCollaborateRoomHandlers(collaborateRoom)



const PORT = process.env.PORT || 3000;





mongoose.connect('mongodb://localhost:27017/mongo')
.then(() => console.log("Connected to DB"))
.catch(err => console.error("DB connection error:", err));


sequelize.sync().then(() => {
  httpServer.listen(PORT,"0.0.0.0", () => {
    console.log(`Server running on ${PORT}`);
  });
});