import express, {Request, Response} from "express";
import {requireAuth, validateRequest} from "@atgitix/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";

const router = express.Router();

router.post('/api/tickets', [
    //Validation middleware
    body("title").trim().notEmpty().withMessage("Title Required"),
    body("price").trim().isFloat({gt: 0}).withMessage("Price must be greater than 0")
], requireAuth, validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });
    await ticket.save();

    res.status(201).send(ticket);
});

export {router as createTicketRouter};