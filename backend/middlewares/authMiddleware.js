const jwt = require("jsonwebtoken");


const SECRET = process.env.SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

async function authenticateToken(req, res, next) {

    // if (req.method === "OPTIONS") {
    //     return res.sendStatus(204);
    // }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: no token" });
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Session expired. Please log in again." });
            }
            return res.status(403).json({ message: "Forbidden: invalid token" });
        }
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken }