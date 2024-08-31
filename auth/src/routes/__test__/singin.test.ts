const request = require('supertest');  // Import the `supertest` module to simulate HTTP requests in tests.
import {app} from "../../app";        // Import the Express application instance from the app module.

/**
 * This script contains a series of test cases to verify the functionality of the user authentication system,
 * specifically focusing on the sign-in process. It tests various scenarios including invalid credentials,
 * incorrect passwords, and successful sign-in that returns a session cookie.
 */

it('fails when an email that does not exist is supplied', async () => {
    /**
     * Test Case 1: Invalid Email
     *
     * This test verifies that the application responds with a 400 status code when an attempt is made to sign in
     * with an email that does not exist in the system. This ensures that the application correctly handles
     * invalid email addresses during the sign-in process.
     */

    const response = await request(app)
        .post('/api/users/signin')           // Simulate a POST request to the signin endpoint.
        .send({
            email: 'test@test.com',          // Supply a non-existent email address.
            password: 'password'             // Provide any password.
        })
        .expect(400);                        // Expect a 400 status code indicating a failed sign-in attempt.
});

it('fails when an incorrect password is supplied', async () => {
    /**
     * Test Case 2: Incorrect Password
     *
     * This test ensures that the application responds with a 400 status code when the correct email but
     * an incorrect password is supplied during the sign-in process. This is critical for securing user accounts
     * by preventing unauthorized access with incorrect credentials.
     */

    const userSignupResponse = await request(app)
        .post('/api/users/signup')           // Simulate a POST request to the signup endpoint to create a new user.
        .send({
            email: 'test@test.com',          // Provide the email address for the new user.
            password: 'password'             // Provide a valid password.
        })
        .expect(201);                        // Expect a 201 status code indicating successful signup.

    // Verify that the signup process set a session cookie.
    expect(userSignupResponse.get('Set-Cookie')).toBeDefined();

    await request(app)
        .post('/api/users/signin')           // Simulate a POST request to the signin endpoint.
        .send({
            email: 'test@test.com',          // Provide the correct email address.
            password: 'wrongpassword'        // Supply an incorrect password.
        })
        .expect(400);                        // Expect a 400 status code indicating a failed sign-in attempt.
});

it('responds with a cookie when given valid credentials', async () => {
    /**
     * Test Case 3: Successful Sign-In
     *
     * This test confirms that the application responds with a session cookie when the correct email and password
     * are supplied during the sign-in process. This session cookie is critical for maintaining the user's session
     * and verifying their identity on subsequent requests.
     */

    const userSignupResponse = await request(app)
        .post('/api/users/signup')           // Simulate a POST request to the signup endpoint to create a new user.
        .send({
            email: 'test@test.com',          // Provide the email address for the new user.
            password: 'password'             // Provide a valid password.
        })
        .expect(201);                        // Expect a 201 status code indicating successful signup.

    // Verify that the signup process set a session cookie.
    expect(userSignupResponse.get('Set-Cookie')).toBeDefined();

    const userSigninResponse = await request(app)
        .post('/api/users/signin')           // Simulate a POST request to the signin endpoint.
        .send({
            email: 'test@test.com',          // Provide the correct email address.
            password: 'password'             // Provide the correct password.
        })
        .expect(200);                        // Expect a 200 status code indicating a successful sign-in.

    // Verify that the signin process set a session cookie.
    expect(userSigninResponse.get('Set-Cookie')).toBeDefined();
});