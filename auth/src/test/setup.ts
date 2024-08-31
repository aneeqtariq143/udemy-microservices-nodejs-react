import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";
import request from "supertest";

// Start Set up the in-memory MongoDB database
let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'testjwtkey';
    // Create a new instance of MongoDB in memory
    const mongo = await MongoMemoryServer.create();
    // Get the URI of the in-memory MongoDB instance
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

// Clear the database before each test
beforeEach(async () => {
    // Get all the collections in the database
    const collections = await mongoose.connection.db?.collections();


    // Delete all the collections
    if (collections) {
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});

// Close the connection to the in-memory database and stop the instance
afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
});
// End Set up the in-memory MongoDB database