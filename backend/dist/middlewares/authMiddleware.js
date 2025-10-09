"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided." });
    }
    const jwtSecret = process.env.SECRET;
    if (!jwtSecret) {
        console.error("JWT Secret is not defined in environment variables.");
        return res.status(500).json({ message: "Server configuration error." });
    }
    jsonwebtoken_1.default.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Session expired. Please log in again." });
            }
            return res.status(403).json({ message: "Forbidden: Invalid token." });
        }
        req.user = decoded;
        next();
    });
};
exports.authenticateToken = authenticateToken;
