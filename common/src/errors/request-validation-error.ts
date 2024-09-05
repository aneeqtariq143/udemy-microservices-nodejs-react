import { ValidationError } from "express-validator";
import {CustomError} from "./custom-error";

export class RequestValidationError extends CustomError {
    statusCode: number = 400;
    constructor(public errors: ValidationError[]) {
        // call the constructor of the built-in `Error` class
        super('Invalid request parameters');

        // Only because we are extending a built-in `Error` class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map((error: ValidationError) => {
            return {message: error.msg, field: (error.type === 'field') ? error.path : ''};
        });
    }
}