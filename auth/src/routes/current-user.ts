import express, {Router, Request, Response} from "express";
import {requireAuth, currentUser} from "@atgitix/common";

const router: Router = express.Router();

router.get("/api/users/currentuser", currentUser, requireAuth, (req: Request, res: Response) => {
    res.send({currentUser: req.currentUser || null});
});

export {router as currentUserRouter};