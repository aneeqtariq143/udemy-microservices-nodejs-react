// Import the required modules for testing
// 'supertest' is a library that allows us to test HTTP endpoints
// 'app' is the Express application instance to be tested
const request = require('supertest');
import {app} from "../../app";

/**
 * This test case verifies the behavior of the signout functionality in the application.
 *
 * It ensures that after a user successfully signs out, the session cookie is cleared,
 * meaning the user is effectively logged out.
 */
it('clears the cookie after signing out', async () => {
    // Step 1: Make a signup request
    // This sends a POST request to the '/api/users/signup' endpoint
    // with the given email and password to create a new user.
    // It expects a 201 status code, which indicates successful signup.
    const userSignupResponse = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'aneeqtariq_143@yahoo.com',
            password: 'password'
        })
        .expect(201);

    // Step 2: Check if the 'Set-Cookie' header is present in the response
    // After successful signup, a session cookie should be set in the response headers.
    // This cookie is used to maintain user authentication state.
    expect(userSignupResponse.get('Set-Cookie')).toBeDefined();

    // Step 3: Make a signout request
    // This sends a POST request to the '/api/users/signout' endpoint
    // to sign the user out. It expects a 200 status code, which indicates successful signout.
    const userSignoutResponse = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200);

    // Step 4: Verify that the cookie is cleared after signing out
    // The 'Set-Cookie' header in the signout response should indicate that the session
    // cookie is cleared. It does this by setting the cookie value to an empty string,
    // the path to '/', and the expiration date to a date in the past.
    expect(userSignoutResponse.get('Set-Cookie')?.[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
});