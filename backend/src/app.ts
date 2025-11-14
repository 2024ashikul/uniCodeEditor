import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import serveIndex from 'serve-index';
// Route Importsx
import userRoutes from './routes/user.route';
import fileRoutes from './routes/file.route';
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
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import type { IncomingMessage } from 'http';
import type { Socket } from 'net';
import {startLab} from './controllers/labController'

const app: Application = express();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: false, 
}));

// const ideProxy = createProxyMiddleware({
//   xfwd: true,
//   target: 'http://localhost:8080',
//   changeOrigin: true,
//   ws: true,
//   logger: console,
//   secure : false
// });

app.use(async (req, res, next) => {
  await new Promise(resolve => setTimeout(resolve, 300)); // 1 second
  next();
});

app.get("/", (req: Request, res: Response) => {
  
  res.status(200).json("Hello from unicode backend!");
});


app.use(express.json());
app.use(compression());
// app.use('/ide', ideProxy);


app.post('/lab/create', startLab);
app.use(
  "/profilephotos",
  express.static(path.join(process.cwd(), "uploads", "profile_photos"))
);

app.use('/files', express.static(path.join(__dirname, '/files')));


app.use(
  "/materials",
  express.static(path.join(process.cwd(), "uploads", "materials"))
  ,
  serveIndex(path.join(process.cwd(), "uploads", "materials"), { icons: true })
);

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
app.use('/files', fileRoutes);



// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello from the Express + TypeScript server!');
// });


app.post("/sensor", (req: Request, res: Response) => {
  console.log("Data received from ESP32:", req.body);
  res.status(200).send("Data received successfully!");
});


// export { ideProxy };
export default app;
