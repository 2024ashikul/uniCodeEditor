const { createServer } = require('http')
const { Server } = require('socket.io')
const { sequelize } = require('./models');
const app = require('./app');

const httpServer = createServer(app);
const mongoose = require('mongoose')
const registerSocketHandler = require('./sockets/socket')

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

registerSocketHandler.registerSocketHandlers(io);

mongoose.connect('mongodb://localhost:27017/mongo')
.then(() => console.log("Connected to DB"))
.catch(err => console.error("DB connection error:", err));


sequelize.sync().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});