import request from "supertest";
import {app} from "../app";

export const signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const userSignupResponse = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201);

    // Verify that the signup process set a session cookie.
    expect(userSignupResponse.get('Set-Cookie')).toBeDefined();

    return userSignupResponse.get('Set-Cookie');
};