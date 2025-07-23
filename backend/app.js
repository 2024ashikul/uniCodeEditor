const express = require('express')
const cors = require('cors')
const app = express();
const path = require('path')

app.use(express.json());
app.use(cors());

const submitRoutes = require('./routes/codeSubmit');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

app.use('/', submitRoutes);
app.use('/', userRoutes);
app.use('/', roomRoutes);
app.use('/', assignmentRoutes);
app.use('/files', express.static(path.join(__dirname, '/files')));


app.post("/sensor", (req, res) => {
  console.log("Data received from ESP32:", req.body);
  res.send("Data received!");
});

app.get('/', (req, res) => {
  res.send('hello from express');
});

module.exports = app;




