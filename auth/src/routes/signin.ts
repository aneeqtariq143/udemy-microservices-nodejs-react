import express, {Request, Response, Router} from "express";
import {body} from "express-validator";
import jwt from "jsonwebtoken";
import {validateRequest} from "../middlewares/validate-request";
import {User, UserDoc} from "../models/user";
import {BadRequestError} from "../errors/bad-request-error";
import {Password} from "../services/password";


const router: Router = express.Router();

router.post("/api/users/signin",
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body;

        const existingUser: UserDoc|null = await User.findOne({email}).exec();
        if(!existingUser){
            throw new BadRequestError('Invalid credentials');
        }

        const passwordsMatch: boolean = await Password.compare(existingUser.password, password);
        if(!passwordsMatch){
            throw new BadRequestError('Invalid credentials');
        }

        // Generate JWT
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!);

        // Store it on session object
        req.session = {
            jwt: userJwt
        };

        res.status(200).send(existingUser);
    });

export {router as signinRouter};