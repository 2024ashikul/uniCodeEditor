const express = require('express')
const cors = require('cors')
const app = express();
const fs = require('fs')
const compression = require('compression');
app.use(express.json());
const path = require('path')
app.use(compression());
const archiver = require("archiver");

const serveIndex = require('serve-index');
app.use(cors({
  origin: "*",  // allow all 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: false,
  maxAge: 86400 //24 hrs
}));


const submitRoutes = require('./routes/codeSubmit');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const meetingRoutes = require('./routes/meetingRoutes')
const aiRoutes = require('./routes/aiRoutes')
const lessonRoutes = require('./routes/routesLesson')
const problemRoutes = require('./routes/problemRoutes')
const submissionRoutes = require('./routes/submissionRoutes')
const announcementRoutes = require('./routes/announcementRoutes')
const fileRoutes =require('./routes/fileRoutes')
const materialRoutes =require('./routes/materialRoutes')

app.use('/', submitRoutes);
app.use('/auth/', userRoutes);
app.use('/room/', roomRoutes);
app.use('/problem/',problemRoutes)
app.use('/assessment/', assessmentRoutes);
app.use('/submission/', submissionRoutes);
app.use('/meeting', meetingRoutes);
app.use('/', aiRoutes)
app.use('/lesson/',lessonRoutes)
app.use('/announcement/',announcementRoutes)
app.use('/',fileRoutes)
app.use('/material',materialRoutes)


// app.get("/download/:folder/:filename", (req, res) => {
//   const { folder, filename } = req.params;
//   const filePath = path.join(process.cwd(), "uploads", "submissions", folder, filename);

//   if (fs.existsSync(filePath)) {
//     res.download(filePath, filename, (err) => {
//       if (err) {
//         console.error("Download error:", err);
//         res.status(500).send("Error downloading file.");
//       }
//     });
//   } else {
//     res.status(404).send("File not found.");
//   }
// });

app.post("/sensor", (req, res) => {
  console.log("Data received from ESP32:", req.body);
  res.send("Data received!");
});

app.get('/', (req, res) => {
  res.send('hello from express');
});

module.exports = app;




