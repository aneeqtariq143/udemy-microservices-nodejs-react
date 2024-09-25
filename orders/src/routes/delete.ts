import express, {Request, Response,} from "express";
import * as mongoose from "mongoose";
import {
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest,
    NotAuthorizedError
} from "@atgitix/common";
import {param} from "express-validator";
import {Order} from "../models/order";
import {natsWrapper} from "../nats-wrapper";
import {OrderCancelledPublisher} from "../events/publishers/order-cancelled-publisher";

const router = express.Router();

router.delete("/api/orders/:id",
    requireAuth,
    [
        param("id")
            .notEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("OrderId must be provided")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.params.id).populate('ticket');
        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();

        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        // Publish an event saying this was cancelled!
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        res.status(204).send(order);
    });

export {router as deleteOrderRouter};