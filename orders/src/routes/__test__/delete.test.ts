import supertest from "supertest";
import {app} from "../../app";
import {signin} from "../../test/auth-signup-cookie";
import * as mongoose from "mongoose";
import {Ticket} from "../../models/ticket";
import {OrderStatus} from "@atgitix/common";
import {natsWrapper} from "../../nats-wrapper";


it('has a route handler listing to a /api/orders for post request', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const response = await supertest(app)
        .get(`/api/orders/${orderId}`)
        .send({});
    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();

    await supertest(app)
        .delete(`/api/orders/${orderId}`)
        .send({})
        .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    const response = await supertest(app)
        .delete(`/api/orders/${orderId}`)
        .set('Cookie',  cookie)
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid orderId provided', async () => {
    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    await supertest(app)
        .delete(`/api/orders/abc`)
        .set('Cookie',  cookie)
        .send({})
        .expect(400);
});

it('delete order does not exist', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    await supertest(app)
        .delete(`/api/orders/${orderId}`)
        .set('Cookie',  cookie)
        .send({})
        .expect(404);
});

it('delete order which does not belong to the requested user', async () => {
    const user1 = await signin()
    const user2 = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!user1 || !user2) {
        throw new Error('Cookie is not defined');
    }

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();
    const order = await supertest(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ticketId: ticket.id})
        .expect(201);


    await supertest(app)
        .delete(`/api/orders/${order.body.id}`)
        .set('Cookie',  user2)
        .send({})
        .expect(401);
});

it('Delete order which belong to the requested user', async () => {
    const user1 = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!user1) {
        throw new Error('Cookie is not defined');
    }

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();
    const order = await supertest(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ticketId: ticket.id})
        .expect(201);


    await supertest(app)
        .delete(`/api/orders/${order.body.id}`)
        .set('Cookie',  user1)
        .send({})
        .expect(204);

    const orderResponse = await supertest(app)
        .get(`/api/orders/${order.body.id}`)
        .set('Cookie',  user1)
        .send({})
        .expect(200);

    expect(orderResponse.body.id).toEqual(order.body.id);
    expect(orderResponse.body.ticket.id).toEqual(ticket.id);
    expect(orderResponse.body.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
    const user1 = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!user1) {
        throw new Error('Cookie is not defined');
    }

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();
    const order = await supertest(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ticketId: ticket.id})
        .expect(201);


    await supertest(app)
        .delete(`/api/orders/${order.body.id}`)
        .set('Cookie',  user1)
        .send({})
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const orderResponse = await supertest(app)
        .get(`/api/orders/${order.body.id}`)
        .set('Cookie',  user1)
        .send({})
        .expect(200);

    expect(orderResponse.body.id).toEqual(order.body.id);
    expect(orderResponse.body.ticket.id).toEqual(ticket.id);
    expect(orderResponse.body.status).toEqual(OrderStatus.Cancelled);
});