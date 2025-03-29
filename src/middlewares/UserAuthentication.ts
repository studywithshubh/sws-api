import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_USER_SECRET } from "../config";

export const UserAuth = (req: Request, res: Response, next: NextFunction) => {
    // Try multiple ways to get the token
    // let token = req.cookies?.token ||
    //     req.headers?.authorization?.split(' ')[1] ||
    //     req.headers?.cookie?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

    let token = req.cookies.token;
    
    if (!token) {
        // console.log('No token found in:', {
        //     cookies: req.cookies,
        //     authHeader: req.headers.authorization,
        //     allHeaders: req.headers
        // });
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_USER_SECRET) as { id: string; email: string };
        (req as any).user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(403).json({ message: "Invalid or expired token" });
        return
    }
};