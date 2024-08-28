import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import {currentUserRouter} from "./routes/current-user";
import {signinRouter} from "./routes/signin";
import {signoutRouter} from "./routes/signout";
import {signupRouter} from "./routes/signup";
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';

const app = express();
app.use(json());

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

app.listen(3000, () => {
  console.log('Listening on port 3000!!!!');
});