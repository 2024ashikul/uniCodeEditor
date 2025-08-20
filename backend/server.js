const { createServer } = require('http')
const { Server } = require('socket.io')
const { sequelize } = require('./models');
const app = require('./app');

const httpServer = createServer(app);
const mongoose = require('mongoose')
const {registerCollabHandlers} = require('./sockets/collabRoom')
const {registerClassHandlers} = require('./sockets/classRoom')
const {registerAuthClassHandlers} = require('./sockets/classAuthRoom')

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


const collabSpace = io.of('/collab');
const classSpace = io.of('/class');
const classAuthSpace = io.of('/classauth')

registerClassHandlers(classSpace);
registerCollabHandlers(collabSpace);
registerAuthClassHandlers(classAuthSpace);



const PORT = process.env.PORT || 3000;




mongoose.connect('mongodb://localhost:27017/mongo')
.then(() => console.log("Connected to DB"))
.catch(err => console.error("DB connection error:", err));


sequelize.sync().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});