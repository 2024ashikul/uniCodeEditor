"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ideProxy = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const serve_index_1 = __importDefault(require("serve-index"));
// Route Importsx
const user_route_1 = __importDefault(require("./routes/user.route"));
const file_route_1 = __importDefault(require("./routes/file.route"));
const room_route_1 = __importDefault(require("./routes/room.route"));
const assessment_route_1 = __importDefault(require("./routes/assessment.route"));
const meeting_route_1 = __importDefault(require("./routes/meeting.route"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const lesson_route_1 = __importDefault(require("./routes/lesson.route"));
const problem_route_1 = __importDefault(require("./routes/problem.route"));
const submission_route_1 = __importDefault(require("./routes/submission.route"));
const announcement_route_1 = __importDefault(require("./routes/announcement.route"));
// import fileRoutes from './archive/routes/fileRoutes'; 
const material_route_1 = __importDefault(require("./routes/material.route"));
const authorization_route_1 = __importDefault(require("./routes/authorization.route"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false,
}));
const ideProxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
    xfwd: true,
    target: 'http://localhost:8080',
    changeOrigin: true,
    ws: true,
    logger: console,
    secure: false
});
exports.ideProxy = ideProxy;
app.use(express_1.default.json());
app.use((0, compression_1.default)());
app.use('/ide', ideProxy);
app.use("/profilephotos", express_1.default.static(path_1.default.join(process.cwd(), "uploads", "profile_photos")));
app.use('/files', express_1.default.static(path_1.default.join(__dirname, '/files')));
app.use("/materials", express_1.default.static(path_1.default.join(process.cwd(), "uploads", "materials")), (0, serve_index_1.default)(path_1.default.join(process.cwd(), "uploads", "materials"), { icons: true }));
app.use('/auth', user_route_1.default);
app.use('/room', room_route_1.default);
app.use('/problem', problem_route_1.default);
app.use('/assessment', assessment_route_1.default);
app.use('/submission', submission_route_1.default);
app.use('/meeting', meeting_route_1.default);
app.use('/', ai_routes_1.default);
app.use('/lesson', lesson_route_1.default);
app.use('/announcement', announcement_route_1.default);
// app.use('/files', fileRoutes); // Changed from '/' to '/files' for clarity
app.use('/material', material_route_1.default);
app.use('/', authorization_route_1.default);
app.use('/files', file_route_1.default);
// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello from the Express + TypeScript server!');
// });
app.post("/sensor", (req, res) => {
    console.log("Data received from ESP32:", req.body);
    res.status(200).send("Data received successfully!");
});
exports.default = app;
