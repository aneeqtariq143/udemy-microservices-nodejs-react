import { OrderCancelledListener} from "../order-cancelled-listener";
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledEvent, OrderStatus } from '@atgitix/common';
import mongoose from 'mongoose';
import {Ticket} from "../../../models/ticket";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    ticket.set({orderId});
    await ticket.save();

    // Create a fake data event
    const data: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id
        }
    };

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    // Return all of this stuff
    return {listener, data, msg, ticket};
}

it('sets the orderId to undefined of the ticket', async () => {
    const {listener, data, msg, ticket} = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure a ticket was updated
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
});

it('acks the message', async () => {
    const {listener, data, msg} = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const {listener, data, msg} = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure ack function is called
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    /**
     * Below is the output of the TicketUpdatedPublisher class
     */
    // console.log((natsWrapper.client.publish as jest.Mock).mock.calls);

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(ticketUpdatedData.orderId).not.toBeDefined();
});