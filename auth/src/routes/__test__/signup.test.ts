const request = require('supertest');
import {app} from "../../app";

/**
 * Test case: Successful signup
 * Description: This test verifies that a user can successfully sign up by sending valid email and password.
 * Expected Outcome: The response should have a status code of 201 (Created).
 */
it('returns a 201 on successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'aneeqtariq_143@yahoo.com',
            password: 'password'
        })
        .expect(201);

    //Check response body that email and id is returned
    expect(response.body.email).toEqual('aneeqtariq_143@yahoo.com');
    expect(response.body.id).toBeDefined();
});

/**
 * Test case: Invalid email format
 * Description: This test checks that the signup process fails when an invalid email is provided.
 * Expected Outcome: The response should have a status code of 400 (Bad Request).
 */
it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'aneeqtariq_143@yahoo',
            password: 'password'
        })
        .expect(400);
});

/**
 * Test case: Invalid password format
 * Description: This test verifies that the signup process fails when an invalid password is provided (e.g., too short).
 * Expected Outcome: The response should have a status code of 400 (Bad Request).
 */
it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'aneeqtariq_143@yahoo.com',
            password: 'p'  // Password too short
        })
        .expect(400);
});

/**
 * Test case: Missing email or password
 * Description: This test checks that the signup process fails when either the email or password is missing.
 * Expected Outcome: The response should have a status code of 400 (Bad Request) for both cases.
 *
 * Note: We can send multiple requests in a single test case by chaining the request methods.
 */
it('returns a 400 with missing email and password', async () => {
    // Missing password
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'aneeqtariq_143@yahoo.com',
        })
        .expect(400);

    // Missing email
    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'asdasfdsa',
        })
        .expect(400);
});

/**
 * Test case: Duplicate email addresses
 * Description: This test checks that the signup process prevents creating multiple accounts with the same email.
 * Expected Outcome: The first request should return a 201 status code (Created), and the second should return a 400 (Bad Request).
 *
 * Note: We can send multiple requests in a single test case by chaining the request methods.
 */
it('disallows duplicate emails', async () => {
    // First signup attempt with a unique email
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'aneeqtariq_143@yahoo.com',
            password: 'password'
        })
        .expect(201);

    // Second signup attempt with the same email
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'aneeqtariq_143@yahoo.com',
            password: 'password'
        })
        .expect(400);
});

/**
 * Test case: Cookie is set after successful signup
 * Description: This test ensures that a cookie is set in the response headers after a successful signup, indicating that the user is logged in.
 * Expected Outcome: The 'Set-Cookie' header should be defined in the response.
 */
it('sets a cookie after successful signup', async () => {
    // Make a signup request
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'aneeqtariq_143@yahoo.com',
            password: 'password'
        })
        .expect(201);

    //Check response body that email and id is returned
    expect(response.body.email).toEqual('aneeqtariq_143@yahoo.com');
    expect(response.body.id).toBeDefined();

    // Check if the 'Set-Cookie' header is present in the response
    expect(response.get('Set-Cookie')).toBeDefined();
});