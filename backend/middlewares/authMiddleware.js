const jwt = require("jsonwebtoken");


const SECRET =process.env.SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: no token" });
    console.log(token);
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Forbidden: invalid token" });
        req.user = user; 
        next();
    });
}

module.exports = { authenticateToken }