import {BaseListener, Subjects, ExpirationCompleteEvent, OrderStatus} from "@atgitix/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Order} from "../../models/order";
import {OrderCancelledPublisher} from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends BaseListener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        console.log("ExpirationCompleteListener: Event data!", data);

        const order = await Order.findById(data.orderId).populate("ticket");

        if(!order){
            throw new Error("Order not found");
        }

        if(order.status === "complete"){
            return msg.ack();
        }

        order.set({
            status: OrderStatus.Cancelled,
        });
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version!,
            ticket: {
                id: order.ticket.id,
            }
        });

        msg.ack();
    }
}