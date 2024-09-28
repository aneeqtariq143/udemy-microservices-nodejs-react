import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";
import request from "supertest";

/**
 * What's actually happening here is that Jest is mocking the nats-wrapper module.
 * Instead of importing real `nats-wrapper` file, jest will look the identical file in __mocks__ folder and fake it
 */
jest.mock('../nats-wrapper');

/**
 * We need to set up the Stripe key as an environment variable as soon as possible in the test environment.
 * that's why we are setting it up here.
 */
process.env.STRIPE_KEY = 'sk_test_51Q3Z032KK1G4uvpsfEDOugs6rPFSNIpcmlIC5Ie2ZIVtYj2nBvJ7dehAn1DxilN80SxkxmjKsD1dhUhazESRui23006uy7s4k0';

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
    /**
     * Reset all mocks.
     * We want to make sure that between every single test we reset that data that we're not somehow running a test and polluting one test with data from another 10.
     */
    jest.clearAllMocks();

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