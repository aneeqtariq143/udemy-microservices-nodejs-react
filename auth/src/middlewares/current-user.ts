import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

// Define a new interface called UserPayload
interface UserPayload {
    id: string;
    email: string;
}

// Augment the Request interface from Express
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    // If there is no session or jwt property on the session object, then the user is not logged in
    if(!req.session?.jwt){
        return next();
    }

    try {
        req.currentUser = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    } catch (e) {
        console.log(e);
    }

    next();
}