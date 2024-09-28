import {Message} from 'node-nats-streaming';
import {Subjects, BaseListener, PaymentCreatedEvent, OrderStatus} from "@atgitix/common";
import {Order} from "../../models/order";
import {queueGroupName} from "./queue-group-name";
import {OrderUpdatedPublisher} from "../publishers/order-updated-publisher";
import {natsWrapper} from "../../nats-wrapper";

export class PaymentCreatedListener extends BaseListener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const {orderId} = data;

        const order = await Order.findById(orderId);

        if(!order) {
            throw new Error("Order not found");
        }

        order.set({
            status: OrderStatus.Complete
        });
        order.save();

        new OrderUpdatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status
        });

        msg.ack();
    }
}