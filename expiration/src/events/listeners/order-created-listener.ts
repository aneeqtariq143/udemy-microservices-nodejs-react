import {BaseListener, OrderCreatedEvent, Subjects} from "@atgitix/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {expirationQueue} from "../../queues/expiration-queue";

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        // Calculate the Precise delay
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log(`Waiting ${delay} milliseconds to process the job`);


        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        })

        msg.ack();
    }

}