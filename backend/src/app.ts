import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';

// Route Imports
import userRoutes from './routes/user.route';
import roomRoutes from './routes/room.route';
import assessmentRoutes from './routes/assessment.route';
import meetingRoutes from './routes/meeting.route'
import aiRoutes from './routes/ai.routes';
import lessonRoutes from './routes/lesson.route';
import problemRoutes from './routes/problem.route';
import submissionRoutes from './routes/submission.route';
import announcementRoutes from './routes/announcement.route';
// import fileRoutes from './archive/routes/fileRoutes'; 
import materialRoutes from './routes/material.route';
import userAccessRoutes from './routes/authorization.route'


const app: Application = express();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: false, 
}));

app.use(express.json());

app.use(compression());


app.use('/auth', userRoutes);
app.use('/room', roomRoutes);
app.use('/problem', problemRoutes);
app.use('/assessment', assessmentRoutes);
app.use('/submission', submissionRoutes);
app.use('/meeting', meetingRoutes);
app.use('/', aiRoutes); 
app.use('/lesson', lessonRoutes);
app.use('/announcement', announcementRoutes);
// app.use('/files', fileRoutes); // Changed from '/' to '/files' for clarity
app.use('/material', materialRoutes);
app.use('/',userAccessRoutes)


app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the Express + TypeScript server!');
});


app.post("/sensor", (req: Request, res: Response) => {
  console.log("Data received from ESP32:", req.body);
  res.status(200).send("Data received successfully!");
});



export default app;
