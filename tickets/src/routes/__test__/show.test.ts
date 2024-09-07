import supertest from "supertest";
import {app} from "../../app";
import {Ticket} from "../../models/ticket";
import {signin} from "../../test/auth-signup-cookie";
import mongoose from "mongoose";

it('return a 404 if the ticket is not found', async () => {

    //Option#1 Generate a valid mongodb random id
    const id = new mongoose.Types.ObjectId().toHexString();

    // or

    //Option#2 Generate a valid mongodb random id
    // const id = new Ticket().id;


    // We can not pass some random id to the route, because it will throw an error
    // So we need to pass a valid mongodb id
    await supertest(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
});

it('returns the ticket if the ticket is found', async () => {
    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    const title = 'Concert';
    const price = 20;

    const response = await supertest(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title,
            price
        })
        .expect(201);

    const ticketResponse = await supertest(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});