import supertest from "supertest";
import {app} from "../../app";
import {signin} from "../../test/auth-signup-cookie";
import * as mongoose from "mongoose";
import {Order, OrderStatus} from "../../models/order";
import {Ticket} from "../../models/ticket";
import {natsWrapper} from "../../nats-wrapper";


it('has a route handler listing to a /api/orders for post request', async () => {
    const response = await supertest(app)
        .post('/api/orders')
        .send({});
    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    await supertest(app)
        .post('/api/orders')
        .send({})
        .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {

    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    const response = await supertest(app)
        .post('/api/orders')
        .set('Cookie',  cookie)
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid ticketId provided', async () => {
    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    await supertest(app)
        .post('/api/orders')
        .set('Cookie',  cookie)
        .send({
            ticketId: 'asdd'
        })
        .expect(400);
});

it('returns an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();

    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    await supertest(app)
        .post('/api/orders')
        .set('Cookie',  cookie)
        .send({
            ticketId: ticketId
        })
        .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();
    // Create an order with the ticket, To assume the ticket is already reserved by another user
    const order = Order.build({
        ticket,
        userId: 'asdasd',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });
    await order.save();

    await supertest(app)
        .post('/api/orders')
        .set('Cookie',  cookie)
        .send({
            ticketId: ticket.id
        })
        .expect(400);


});

it('reserves a ticket', async () => {
    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const response = await supertest(app)
        .post('/api/orders')
        .set('Cookie',  cookie)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.ticket.id).toEqual(ticket.id);
});

it('emits an order created event', async () => {
    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const response = await supertest(app)
        .post('/api/orders')
        .set('Cookie',  cookie)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.ticket.id).toEqual(ticket.id);

    // Check if the event is emitted
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})