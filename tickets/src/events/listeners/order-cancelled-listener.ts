import {BaseListener, OrderCancelledEvent, Subjects} from "@atgitix/common";
import {Message} from 'node-nats-streaming';
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        /**
         * No need to update for version number here because the
         * version number is updated by the `mongoose-update-if-current` plugin in the ticket model upon saving
         */
        ticket.set({orderId: undefined});
        await ticket.save();

        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        })

        msg.ack();
    }
}