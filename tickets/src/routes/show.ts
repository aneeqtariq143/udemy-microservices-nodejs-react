import express, {Request, Response} from "express";
import {requireAuth, validateRequest} from "@atgitix/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";
import {NotFoundError} from "@atgitix/common";

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    res.send(ticket);
});

export {router as showTicketRouter};