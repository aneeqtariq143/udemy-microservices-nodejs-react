import {Message} from 'node-nats-streaming';
import {BaseListener, Subjects, TicketUpdatedEvent} from "@atgitix/common";
import {Ticket} from "../../models/ticket";
import {queueGroupName} from "./queue-group-name";

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        /**
         * No need to update for version number here because the
         * version number is updated by the `mongoose-update-if-current` plugin in the ticket model upon saving
         */
        const {title, price} = data;
        ticket.set({title, price});
        await ticket.save();

        msg.ack();
    }

}