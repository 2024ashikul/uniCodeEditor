import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';


declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}


export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  
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

  
  jwt.verify(token, jwtSecret, (err, decoded) => {
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
