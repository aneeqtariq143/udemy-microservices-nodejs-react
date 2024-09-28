import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Create a global function that can be used in all the test files
export const signin = (userId?: string) => {
    //Create a fake JWT token

    // Build a JWT payload. {id, email}
    const payload = {
        id: userId || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };

    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session object {jwt: MY_JWT}
    const session = {jwt: token};

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string that's the cookie with the encoded data
    return `session=${base64}`;
};