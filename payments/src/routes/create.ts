import express, {Request, Response} from "express";
import {body} from "express-validator";
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus
} from "@atgitix/common";
import {Order} from "../models/order";
import mongoose from "mongoose";
import {stripe} from "../stripe";
import {Payment} from "../models/payment";
import {PaymentCreatedPublisher} from "../events/publishers/payment-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [
        body('token')
            .not()
            .isEmpty()
            .withMessage('Token is required'),
        body('orderId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Order ID is required')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {token, orderId} = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for an cancelled order');
        }


        try {
            /**
             * Old method:
             * tok_visa: A test token that simulates a valid credit card
             */
                const response = await stripe.charges.create({
                    amount: order.price * 100, // Convert to cents as stripe expects the amount in cents
                    currency: "usd",
                    source: token
                });

            // const response = await stripe.paymentIntents.create({
            //         amount: order.price * 100, // Convert to cents as stripe expects the amount in cents
            //         currency: "usd",
            //         confirm: true
            //     });

            const payment = Payment.build({
                orderId,
                stripeId: response.id
            });
            await payment.save();

            await new PaymentCreatedPublisher(natsWrapper.client).publish({
                id: payment.id,
                orderId: payment.orderId,
                stripeId: payment.stripeId
            });

            res.status(201).send({id: payment.id});

        } catch (e) {
            console.error(e);
            throw new BadRequestError('Payment failed');
        }
    });

export {router as createChargeRouter};