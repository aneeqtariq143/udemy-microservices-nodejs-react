import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
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
    // Only allow cookies to be shared when the user is visiting our application over HTTPS
    secure: process.env.NODE_ENV !== 'test' // Set to true in production, false in test environment because we are not using HTTPS in test environment
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

export {app}