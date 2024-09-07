import supertest from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {signin} from "../../test/auth-signup-cookie";
import {TicketDoc} from "../../models/ticket";
import request from "supertest";

it('returns a 401 if the user is not authenticated', async () => {
    // Generate a valid MongoDB id
    const id = new mongoose.Types.ObjectId().toHexString();

    await supertest(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'Concert',
            price: 20
        })
        .expect(401);

});


it('returns a 404 if the ticket is not found', async () => {
    // Generate a valid MongoDB id
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = signin();

    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    await supertest(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Concert',
            price: 20
        })
        .expect(404);
});

it('return a 401 if the user does not own the ticket', async () => {
    // Create a ticket with one user
    const creatorCookie = signin();

    if (!creatorCookie) {
        throw new Error('Cookie is not defined');
    }

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', creatorCookie)
        .send({
            title: 'Concert',
            price: 20
        })
        .expect(201);

    // Make request to update the ticket with another user and try to update the ticket of other's ticket
    const updaterCookie = signin();
    if (!updaterCookie) {
        throw new Error('Cookie is not defined');
    }
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', updaterCookie)
        .send({
            title: 'Update Concert',
            price: 202
        })
        .expect(401);
});


it('return a 400 if the user provides a invalid title or price ', async () => {
    // Create a ticket with one user
    const creatorCookie = signin();

    if (!creatorCookie) {
        throw new Error('Cookie is not defined');
    }

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', creatorCookie)
        .send({
            title: 'Concert',
            price: 20
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', creatorCookie)
        .send({
            title: '',
            price: 202
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', creatorCookie)
        .send({
            title: 'Update Concert',
            price: -10
        })
        .expect(400);
});

it('update the ticket', async () => {
// Create a ticket with one user
    const creatorCookie = signin();

    if (!creatorCookie) {
        throw new Error('Cookie is not defined');
    }

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', creatorCookie)
        .send({
            title: 'Concert',
            price: 20
        })
        .expect(201);

    const updateResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', creatorCookie)
        .send({
            title: 'Update Concert',
            price: 202
        })
        .expect(200);

    expect(updateResponse.body.title).toEqual('Update Concert');
    expect(updateResponse.body.price).toEqual(202);

    // Fetch the ticket after update
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual('Update Concert');
    expect(ticketResponse.body.price).toEqual(202);
});
