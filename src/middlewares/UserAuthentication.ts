import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_USER_SECRET } from "../config";

export const UserAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token; // Get the token from cookies

    if (!token) {
        res.status(401).json({
            message: "Unauthorized: No token provided"
        });
        return
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_USER_SECRET) as {
            id: string; email: string
        };
        
        // Attach the decoded user data to the request object
        (req as any).user = decoded;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(403).json({
            message: "Invalid or expired token"
        });
        return
    }
};
