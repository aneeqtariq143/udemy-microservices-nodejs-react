import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import * as mongoose from "mongoose";
import cookieSession from "cookie-session";

import {currentUserRouter} from "./routes/current-user";
import {signinRouter} from "./routes/signin";
import {signoutRouter} from "./routes/signout";
import {signupRouter} from "./routes/signup";
import {NotFoundError} from './errors/not-found-error';
import {errorHandler} from './middlewares/error-handler';

const app = express();
app.set('trust proxy', true); // Trust traffic as being secure even though it is coming from a proxy
app.use(json());
app.use(cookieSession({
    signed: false, // Disable encryption on the cookie
    secure: true // Only allow cookies to be shared when the user is visiting our application over HTTPS
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Middleware to handle non-existent routes
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

// Middleware to handle errors
app.use(errorHandler);

const start = async () => {
    // Check if the JWT_KEY environment variable is defined
    if(!process.env.JWT_KEY){
        throw new Error("JWT_KEY must be defined");
    }

    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!!!!');
    });
};

start();