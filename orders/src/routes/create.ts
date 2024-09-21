import express, {Request, Response} from "express";
import * as mongoose from "mongoose";
import {NotFoundError, OrderStatus, requireAuth, validateRequest, BadRequestError} from "@atgitix/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";
import {Order} from "../models/order";
import {natsWrapper} from "../nats-wrapper";
import {OrderCreatedPublisher} from "../events/publishers/order-created-publisher";

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post("/api/orders",
    requireAuth,
    [
        body("ticketId")
            .notEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("TicketId must be provided")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // Find the ticket the user is trying to order in the database
        const {ticketId} = req.body;
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError();
        }

        // Make sure that this ticket is not already reserved
        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError("Ticket is already reserved");
        }

        // Calculate an expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // Build the order and save it to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });
        await order.save();

        // Publish an event saying that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.__v!,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        });



        res.status(201).send(order);
    });

export {router as createOrderRouter};