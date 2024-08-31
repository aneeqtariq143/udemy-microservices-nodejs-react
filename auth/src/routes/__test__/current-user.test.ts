// Import the required modules for testing
// 'supertest' is a library that allows us to test HTTP endpoints
// 'app' is the Express application instance to be tested
const request = require('supertest');
import {app} from "../../app";
import {signin} from "../../test/auth-signup-cookie";

it('responds with details about the current user', async () => {
    // const userSignupResponse = await request(app)
    //     .post('/api/users/signup')        // Simulate a POST request to the signup endpoint to create a new user.
    //     .send({
    //         email: 'test@test.com',          // Provide the email address for the new user.
    //         password: 'password'             // Provide a valid password.
    //     })
    //     .expect(201);                  // Expect a 201 status code indicating successful signup.
    //
    // // Verify that the signup process set a session cookie.
    // expect(userSignupResponse.get('Set-Cookie')).toBeDefined();

    /**
     * The below Current user response will fail. because we are not setting the cookie in the request.
     *
     * Browser and Postman will automatically set the cookie in the request. But in the test, we have to set the cookie manually.
     */
    const cookie = await signin()

    // Ensure cookie is defined, otherwise throw an error
    if (!cookie) {
        throw new Error('Cookie is not defined');
    }

    const currentUserResponse = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie) // Set the cookie in the request
        .send()
        .expect(200);

    expect(currentUserResponse.body.currentUser.email).toEqual('test@test.com');
});

it('responds with un authorized if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(401);
});
