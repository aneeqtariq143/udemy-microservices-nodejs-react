import express, {Request, Response,} from "express";
import * as mongoose from "mongoose";
import {
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest,
    BadRequestError,
    NotAuthorizedError
} from "@atgitix/common";
import {param} from "express-validator";
import {Ticket} from "../models/ticket";
import {Order} from "../models/order";

const router = express.Router();

router.get("/api/orders/:id",
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

        if(order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();

        }
        res.send(order);
    });

export {router as showOrderRouter};