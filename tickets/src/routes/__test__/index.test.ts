import supertest from "supertest";
import {app} from "../../app";
import {signin} from "../../test/auth-signup-cookie";
import {TicketDoc} from "../../models/ticket";

const tickets = [
    { title: 'Concert', price: 50 },
    { title: 'Movie', price: 15 },
    { title: 'Festival', price: 100 },
    { title: 'Workshop', price: 75 },
    { title: 'Seminar', price: 25 },
    { title: 'Expo', price: 20 },
    { title: 'Lecture', price: 10 },
    { title: 'Concert', price: 30 },
    { title: 'Movie', price: 50 },
    { title: 'Concert', price: 70 },
    { title: 'Seminar', price: 50 },
    { title: 'Workshop', price: 35 }
];

// Seed the tickets for each test case
const seedDatabase = async () => {
    for (const ticket of tickets) {
        await supertest(app)
            .post('/api/tickets')
            .set('Cookie', signin())
            .send(ticket)
            .expect(201);
    }
};

// Test Case 1: Fetch all tickets (no pagination, sorting, or filtering)
it('fetches a list of tickets', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?limit=all')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(12);
});

// Test Case 2: Fetch tickets with pagination (page 1, limit 5)
it('fetches tickets with pagination', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?page=1&limit=5')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(5);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(3);
    expect(response.body.totalTickets).toBe(12);
});

// Test Case 3: Fetch tickets on page 2 with limit 5
it('fetches tickets on page 2 with limit 5', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?page=2&limit=5')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(5);
    expect(response.body.currentPage).toBe(2);
    expect(response.body.totalPages).toBe(3);
    expect(response.body.totalTickets).toBe(12);
});

// Test Case 4: Fetch tickets on page 3 with limit 5
it('fetches tickets on page 3 with limit 5', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?page=3&limit=5')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(2);
    expect(response.body.currentPage).toBe(3);
    expect(response.body.totalPages).toBe(3);
    expect(response.body.totalTickets).toBe(12);
});

// Test Case 5: Fetch All tickets sorted by price in ascending order
it('fetches all tickets sorted by price in ascending order', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?limit=all&sortField=price&sortOrder=asc')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(12);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.totalTickets).toBe(12);
    const prices: number[] = response.body.tickets.map((ticket: TicketDoc) => ticket.price);
    expect(prices).toEqual([10, 15, 20, 25, 30, 35, 50, 50, 50, 70, 75, 100]);
});

// Test Case 6: Fetch tickets sorted by price in ascending order by default pagination
it('fetches all tickets sorted by price in ascending order', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?sortField=price&sortOrder=asc')
        .send()
        .expect(200);


    expect(response.body.tickets.length).toBe(10);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalTickets).toBe(12);
    const prices: number[] = response.body.tickets.map((ticket: TicketDoc) => ticket.price);
    expect(prices).toEqual([10, 15, 20, 25, 30, 35, 50, 50, 50, 70]);
});

// Test Case 7: Fetch tickets sorted by price in ascending order by default pagination Page 2
it('fetches all tickets sorted by price in ascending order', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?sortField=price&sortOrder=asc&page=2')
        .send()
        .expect(200);


    expect(response.body.tickets.length).toBe(2);
    expect(response.body.currentPage).toBe(2);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalTickets).toBe(12);
    const prices: number[] = response.body.tickets.map((ticket: TicketDoc) => ticket.price);
    expect(prices).toEqual([75, 100]);
});

// Test Case 8: Fetch All tickets sorted by price in descending order
it('fetches all tickets sorted by price in descending order', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?limit=all&sortField=price&sortOrder=desc')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(12);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.totalTickets).toBe(12);
    const prices: number[] = response.body.tickets.map((ticket: TicketDoc) => ticket.price);
    expect(prices).toEqual([100, 75, 70, 50, 50, 50, 35, 30, 25, 20, 15, 10]);
});

// Test Case 9: Fetch tickets sorted by price in descending order by default pagination
it('fetches all tickets sorted by price in descending order', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?sortField=price&sortOrder=desc')
        .send()
        .expect(200);


    expect(response.body.tickets.length).toBe(10);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalTickets).toBe(12);
    const prices: number[] = response.body.tickets.map((ticket: TicketDoc) => ticket.price);
    expect(prices).toEqual([100, 75, 70, 50, 50, 50, 35, 30, 25, 20]);
});

// Test Case 10: Fetch tickets sorted by price in descending order by default pagination Page 2
it('fetches all tickets sorted by price in descending order', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?sortField=price&sortOrder=desc&page=2')
        .send()
        .expect(200);


    expect(response.body.tickets.length).toBe(2);
    expect(response.body.currentPage).toBe(2);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalTickets).toBe(12);
    const prices: number[] = response.body.tickets.map((ticket: TicketDoc) => ticket.price);
    expect(prices).toEqual([15, 10]);
});


// Test Case 11: Fetch all tickets sorted by title in ascending order
it('fetches all tickets sorted by title in ascending order', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?limit=all&sortField=title&sortOrder=asc')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(12);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.totalTickets).toBe(12);
    const titles = response.body.tickets.map((ticket: any) => ticket.title);
    expect(titles).toEqual(['Concert', 'Concert', 'Concert', 'Expo', 'Festival', 'Lecture', 'Movie', 'Movie', 'Seminar', 'Seminar', 'Workshop', 'Workshop']);
});

// Test Case 12: Fetch tickets sorted by title in ascending order by default pagination page 1
it('fetches all tickets sorted by title in ascending order by default pagination page 1', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?sortField=title&sortOrder=asc')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(10);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalTickets).toBe(12);
    const titles = response.body.tickets.map((ticket: any) => ticket.title);
    expect(titles).toEqual(['Concert', 'Concert', 'Concert', 'Expo', 'Festival', 'Lecture', 'Movie', 'Movie', 'Seminar', 'Seminar']);
});

// Test Case 13: Fetch tickets sorted by title in ascending order by default pagination page 2
it('fetches all tickets sorted by title in ascending order by default pagination page 2', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?sortField=title&sortOrder=asc&page=2')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(2);
    expect(response.body.currentPage).toBe(2);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalTickets).toBe(12);
    const titles = response.body.tickets.map((ticket: any) => ticket.title);
    expect(titles).toEqual(['Workshop', 'Workshop']);
});

// Test Case 14: Fetch all tickets sorted by title in descending order
it('fetches all tickets sorted by title in descending order', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?limit=all&sortField=title&sortOrder=desc')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(12);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.totalTickets).toBe(12);
    const titles = response.body.tickets.map((ticket: any) => ticket.title);
    expect(titles).toEqual(['Workshop', 'Workshop', 'Seminar', 'Seminar', 'Movie', 'Movie', 'Lecture', 'Festival', 'Expo', 'Concert', 'Concert', 'Concert']);
});

// Test Case 15: Fetch tickets sorted by title in descending order by default pagination page 1
it('fetches all tickets sorted by title in descending order by default pagination page 1', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?sortField=title&sortOrder=desc')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(10);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalTickets).toBe(12);
    const titles = response.body.tickets.map((ticket: any) => ticket.title);
    expect(titles).toEqual(['Workshop', 'Workshop', 'Seminar', 'Seminar', 'Movie', 'Movie', 'Lecture', 'Festival', 'Expo', 'Concert']);
});

// Test Case 16: Fetch tickets sorted by title in descending order by default pagination page 2
it('fetches all tickets sorted by title in descending order by default pagination page 2', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?sortField=title&sortOrder=desc&page=2')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(2);
    expect(response.body.currentPage).toBe(2);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalTickets).toBe(12);
    const titles = response.body.tickets.map((ticket: any) => ticket.title);
    expect(titles).toEqual(['Concert', 'Concert']);
});

// Test Case 17: Fetch tickets filtered by title (like "Concert")
it('fetches tickets filtered by title using LIKE query', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?title=Concert')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(3);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.totalTickets).toBe(3);
    const titles: string[] = response.body.tickets.map((ticket: TicketDoc) => ticket.title);
    expect(titles.every(title => title.includes('Concert'))).toBe(true);
});

// Test Case 18: Fetch tickets filtered by price greater than 50
it('fetches tickets filtered by price greater than 50', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?priceMin=50')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(6);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.totalTickets).toBe(6);
    const prices: number[] = response.body.tickets.map((ticket: TicketDoc) => ticket.price);
    expect(prices.every(price => price >= 50)).toBe(true);
});

// Test Case 19: Fetch tickets filtered by price less than 50
it('fetches tickets filtered by price less than 50', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?priceMax=50')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(9);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.totalTickets).toBe(9);
    const prices: number[] = response.body.tickets.map((ticket: TicketDoc) => ticket.price);
    expect(prices.every(price => price <= 50)).toBe(true);
});

// Test Case 11: Fetch tickets filtered by price range (priceMin=20, priceMax=50)
it('fetches tickets filtered by price range', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?priceMin=20&priceMax=50')
        .send()
        .expect(200);


    expect(response.body.tickets.length).toBe(7);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.totalTickets).toBe(7);
    const prices: number[] = response.body.tickets.map((ticket: TicketDoc) => ticket.price);
    expect(prices.every(price => price >= 20 && price <= 50)).toBe(true);
});

// Test Case 12: Fetch tickets with pagination, sorting, and filtering (combined)
it('fetches tickets with pagination, sorting by price, and title filter', async () => {
    await seedDatabase();

    const response = await supertest(app)
        .get('/api/tickets?page=1&limit=3&sortField=price&sortOrder=asc&title=Concert')
        .send()
        .expect(200);

    expect(response.body.tickets.length).toBe(3);
    expect(response.body.currentPage).toBe(1);
    const titles: string[] = response.body.tickets.map((ticket: TicketDoc) => ticket.title);
    expect(titles.every(title => title.includes('Concert'))).toBe(true);
    const prices: number[] = response.body.tickets.map((ticket: TicketDoc) => ticket.price);
    expect(prices).toEqual([30, 50, 70]); // Sorted by price in ascending order
});