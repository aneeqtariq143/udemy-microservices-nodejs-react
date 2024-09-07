import * as mongoose from "mongoose";
import { app } from "./app";
import * as process from "node:process";

const start = async () => {
    // Check if the JWT_KEY environment variable is defined
    if(!process.env.JWT_KEY){
        throw new Error("JWT_KEY must be defined");
    }

    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI must be defined");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!!!!');
    });
};

start();