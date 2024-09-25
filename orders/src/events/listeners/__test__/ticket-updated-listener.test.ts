import {TicketUpdatedListener} from "../ticket-updated-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {TicketUpdatedEvent} from "@atgitix/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";

const setup = async () => {
    // Create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // Create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10
    });
    await ticket.save();

    // Create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'concert updated',
        price: 200,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    // Return all of this stuff
    return {listener, data, msg, ticket};
}

it('finds, updates, and saves a ticket', async () => {
    const {listener, data, msg, ticket} = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure a ticket was updated
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const {listener, data, msg} = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const {listener, data, msg} = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (err) {

    }

    expect(msg.ack).not.toHaveBeenCalled();
});