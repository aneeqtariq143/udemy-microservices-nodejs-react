import supertest from "supertest";
import {app} from "../../app";
import {signin} from "../../test/auth-signup-cookie";
import {OrderDoc} from "../../models/order";
import {Ticket} from "../../models/ticket";
import {v4 as uuidv4} from "uuid"; // to generate unique titles

interface SeedDatabaseOptions {
    cookie: string;
    totalOrders: number;
}

// Utility function to create a delay (pause) for a given number of milliseconds
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to seed the database with orders for a user
const seedDatabase = async (user1: SeedDatabaseOptions, user2: SeedDatabaseOptions, delayMs: number = 1) => {
    // Helper function to create a ticket and place an order
    const createOrderForUser = async (cookie: string, totalOrders: number, delayMs: number) => {
        for (let i = 0; i < totalOrders; i++) {
            // Generate a unique ticket title and price
            const ticket = Ticket.build({
                title: `Ticket-${uuidv4()}-${i}`, // unique title
                price: Math.floor(Math.random() * 100) + 20 // random price between 20 and 120
            });
            await ticket.save();

            // Create an order for the newly created ticket
            await supertest(app)
                .post('/api/orders')
                .set('Cookie', cookie)
                .send({ticketId: ticket.id})
                .expect(201);

            // Introduce a delay between iterations
            await delay(delayMs);

        }
    };

    // Create orders for both users with a delay between each iteration
    await createOrderForUser(user1.cookie, user1.totalOrders, delayMs);
    await createOrderForUser(user2.cookie, user2.totalOrders, delayMs);
};

it('has a route handler listing to a /api/orders for post request', async () => {
    const response = await supertest(app)
        .get(`/api/orders`)
        .send({});
    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    await supertest(app)
        .get(`/api/orders`)
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
        .get(`/api/orders`)
        .set('Cookie', cookie)
        .send({});

    expect(response.status).not.toEqual(401);
});

it('fetches all orders for an particular user', async () => {
    // Create two users and seed the database with orders
    const user1 = {cookie: await signin(), totalOrders: 3};
    const user2 = {cookie: await signin(), totalOrders: 5};
    await seedDatabase(user1, user2);

    // Fetch orders for user1
    const response = await supertest(app)
        .get(`/api/orders?limit=all`)
        .set('Cookie', user1.cookie)
        .send({})
        .expect(200);

    // Ensure that we only get orders for user1
    expect(response.body.orders.length).toEqual(user1.totalOrders);
});

it('fetches orders for an particular user with pagination', async () => {
    // Create two users and seed the database with orders
    const user1 = {cookie: await signin(), totalOrders: 3};
    const user2 = {cookie: await signin(), totalOrders: 12};
    await seedDatabase(user1, user2);

    // Fetch orders for user1
    const response = await supertest(app)
        .get(`/api/orders?page=1&limit=5`)
        .set('Cookie', user2.cookie)
        .send({})
        .expect(200);

    // Ensure that we only get orders for user2
    expect(response.body.orders.length).toBe(5);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(3);
    expect(response.body.totalOrders).toBe(12);
});

it('fetches orders for an particular user with pagination on Page 2 with limit 5', async () => {
    // Create two users and seed the database with orders
    const user1 = {cookie: await signin(), totalOrders: 3};
    const user2 = {cookie: await signin(), totalOrders: 12};
    await seedDatabase(user1, user2);

    // Fetch orders for user1
    const response = await supertest(app)
        .get(`/api/orders?page=2&limit=5`)
        .set('Cookie', user2.cookie)
        .send({})
        .expect(200);

    // Ensure that we only get orders for user2
    expect(response.body.orders.length).toBe(5);
    expect(response.body.currentPage).toBe(2);
    expect(response.body.totalPages).toBe(3);
    expect(response.body.totalOrders).toBe(12);
});

it('fetches orders for an particular user with pagination on Page 3 with limit 5', async () => {
    // Create two users and seed the database with orders
    const user1 = {cookie: await signin(), totalOrders: 3};
    const user2 = {cookie: await signin(), totalOrders: 12};
    await seedDatabase(user1, user2);

    // Fetch orders for user1
    const response = await supertest(app)
        .get(`/api/orders?page=3&limit=5`)
        .set('Cookie', user2.cookie)
        .send({})
        .expect(200);

    // Ensure that we only get orders for user2
    expect(response.body.orders.length).toBe(2);
    expect(response.body.currentPage).toBe(3);
    expect(response.body.totalPages).toBe(3);
    expect(response.body.totalOrders).toBe(12);
});


it('fetches orders for an particular user with pagination and createdAt sort functionality in ASC', async () => {
    // Create two users and seed the database with orders
    const user1 = {cookie: await signin(), totalOrders: 3};
    const user2 = {cookie: await signin(), totalOrders: 8};
    await seedDatabase(user1, user2, 50);

    // Fetch orders for user1
    const response = await supertest(app)
        .get(`/api/orders?page=1&limit=5&sortField=createdAt&sortOrder=asc`)
        .set('Cookie', user2.cookie)
        .send({})
        .expect(200);

    // Ensure that we only get orders for user2
    expect(response.body.orders.length).toBe(5);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalOrders).toBe(8);

    // Map out the createdAt values to check their order
    const createdAtValues: string[] = response.body.orders.map((order: OrderDoc) => order.createdAt);

// Check if the createdAt values are sorted in ascending order
    expect(createdAtValues).toEqual(createdAtValues.slice().sort());
}, 10000);

it('fetches orders for an particular user with pagination and createdAt sort functionality in ASC Page 2', async () => {
    // Create two users and seed the database with orders
    const user1 = {cookie: await signin(), totalOrders: 3};
    const user2 = {cookie: await signin(), totalOrders: 8};
    await seedDatabase(user1, user2, 50);

    // Fetch orders for user1
    const response = await supertest(app)
        .get(`/api/orders?page=2&limit=5&sortField=createdAt&sortOrder=asc`)
        .set('Cookie', user2.cookie)
        .send({})
        .expect(200);

    // Ensure that we only get orders for user2
    expect(response.body.orders.length).toBe(3);
    expect(response.body.currentPage).toBe(2);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalOrders).toBe(8);

    // Map out the createdAt values to check their order
    const createdAtValues: string[] = response.body.orders.map((order: OrderDoc) => order.createdAt);

// Check if the createdAt values are sorted in ascending order
    expect(createdAtValues).toEqual(createdAtValues.slice().sort());
}, 10000);

it('fetches orders for an particular user with pagination and createdAt sort functionality in DESC Page 1', async () => {
    // Create two users and seed the database with orders
    const user1 = {cookie: await signin(), totalOrders: 3};
    const user2 = {cookie: await signin(), totalOrders: 8};
    await seedDatabase(user1, user2, 50);

    // Fetch orders for user1
    const response = await supertest(app)
        .get(`/api/orders?page=1&limit=5&sortField=createdAt&sortOrder=desc`)
        .set('Cookie', user2.cookie)
        .send({})
        .expect(200);

    // Ensure that we only get orders for user2
    expect(response.body.orders.length).toBe(5);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalOrders).toBe(8);

    // Map out the createdAt values to check their order
    const createdAtValues: string[] = response.body.orders.map((order: OrderDoc) => order.createdAt);

// Check if the createdAt values are sorted in descending order
    expect(createdAtValues).toEqual(createdAtValues.slice().sort().reverse());
}, 10000);

it('fetches orders for an particular user with pagination and createdAt sort functionality in DESC Page 2', async () => {
    // Create two users and seed the database with orders
    const user1 = {cookie: await signin(), totalOrders: 3};
    const user2 = {cookie: await signin(), totalOrders: 8};
    await seedDatabase(user1, user2, 50);

    // Fetch orders for user1
    const response = await supertest(app)
        .get(`/api/orders?page=2&limit=5&sortField=createdAt&sortOrder=desc`)
        .set('Cookie', user2.cookie)
        .send({})
        .expect(200);

    // Ensure that we only get orders for user2
    expect(response.body.orders.length).toBe(3);
    expect(response.body.currentPage).toBe(2);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalOrders).toBe(8);

    // Map out the createdAt values to check their order
    const createdAtValues: string[] = response.body.orders.map((order: OrderDoc) => order.createdAt);

// Check if the createdAt values are sorted in descending order
    expect(createdAtValues).toEqual(createdAtValues.slice().sort().reverse());
}, 10000);

it('fetches orders for an particular user with pagination and invalid filter status', async () => {
    // Create two users and seed the database with orders
    const user1 = {cookie: await signin(), totalOrders: 3};
    const user2 = {cookie: await signin(), totalOrders: 8};
    await seedDatabase(user1, user2);

    // Fetch orders for user1
    const response = await supertest(app)
        .get(`/api/orders?page=1&limit=5&status=creaated`)
        .set('Cookie', user2.cookie)
        .send({})
        .expect(400);
});

it('fetches orders for an particular user with pagination and filter status equal to created', async () => {
    // Create two users and seed the database with orders
    const user1 = {cookie: await signin(), totalOrders: 3};
    const user2 = {cookie: await signin(), totalOrders: 8};
    await seedDatabase(user1, user2);

    // Fetch orders for user1
    const response = await supertest(app)
        .get(`/api/orders?page=1&limit=5&status=created`)
        .set('Cookie', user2.cookie)
        .send({})
        .expect(200);

    // Ensure that we only get orders for user2
    expect(response.body.orders.length).toBe(5);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalOrders).toBe(8);
});

it('fetches orders for an particular user with pagination and filter status equal to complete', async () => {
    // Create two users and seed the database with orders
    const user1 = {cookie: await signin(), totalOrders: 3};
    const user2 = {cookie: await signin(), totalOrders: 8};
    await seedDatabase(user1, user2);

    // Fetch orders for user1
    const response = await supertest(app)
        .get(`/api/orders?page=1&limit=5&status=complete`)
        .set('Cookie', user2.cookie)
        .send({})
        .expect(200);

    // Ensure that we only get orders for user2
    expect(response.body.orders.length).toBe(0);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(0);
    expect(response.body.totalOrders).toBe(0);
});