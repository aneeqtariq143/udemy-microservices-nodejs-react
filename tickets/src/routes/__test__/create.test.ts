import supertest from "supertest";
import {app} from "../../app";
import {signin} from "../../test/auth-signup-cookie";
import {Ticket} from "../../models/ticket";
/**
 * Even though we are importing the natsWrapper from the `nats-wrapper` file, Jest will look for the identical file in the __mocks__ folder and fake it
 * because we have included the jest.mock() in the `src/test/setup.ts` file.
 * To verify this, you can `console.log(natsWrapper)` in this file, and you will see that it is a mock function.
 */
import {natsWrapper} from "../../nats-wrapper";

/**
 * What's actually happening here is that Jest is mocking the nats-wrapper module.
 * Instead of importing real `nats-wrapper` file, jest will look the identical file in __mocks__ folder and fake it
 *
 * It is better to include the jest.mock() in the `src/test/setup.ts` file to avoid including it in every test file.
 */
// jest.mock('../../nats-wrapper');

it('has a route handler listing to a /api/tickets for post request', async () => {
    const response = await supertest(app)
        .post('/api/tickets')
        .send({});
    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    await supertest(app)
        .post('/api/tickets')
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
        .post('/api/tickets')
        .set('Cookie',  cookie)
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title provided', async () => {
    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    await supertest(app)
        .post('/api/tickets')
        .set('Cookie',  cookie)
        .send({
            title: '',
            price: 10
        })
        .expect(400);

    await supertest(app)
        .post('/api/tickets')
        .set('Cookie',  cookie)
        .send({
            price: 10
        })
        .expect(400);

});
it('returns an error if an invalid price provided', async () => {
    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    await supertest(app)
        .post('/api/tickets')
        .set('Cookie',  cookie)
        .send({
            title: 'test',
            price: -10
        })
        .expect(400);

    await supertest(app)
        .post('/api/tickets')
        .set('Cookie',  cookie)
        .send({
            title: 'test'
        })
        .expect(400);
});
it('create a ticket with valid inputs', async () => {
    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    // Check if any ticket exists in the database
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    // Create a ticket
    await supertest(app)
        .post('/api/tickets')
        .set('Cookie',  cookie)
        .send({
            title: 'test',
            price: 10
        })
        .expect(201);

    // Check if the ticket is saved in the database
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);

    // Check if the ticket has the correct attributes
    expect(tickets[0].title).toEqual('test');
    expect(tickets[0].price).toEqual(10);
});

it('publishes an event', async () => {
    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    // Check if any ticket exists in the database
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    // Create a ticket
    await supertest(app)
        .post('/api/tickets')
        .set('Cookie',  cookie)
        .send({
            title: 'test',
            price: 10
        })
        .expect(201);

    // check if the publish function is called
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});