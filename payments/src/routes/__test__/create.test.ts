import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import {signin} from "../../test/auth-signup-cookie";
import mongoose from "mongoose";
import {stripe} from "../../stripe";
import {Payment} from "../../models/payment";

/**
 * Uncomment the following line to mock the stripe module
 * and rename the file to __mocks__/stripe.ts
 */
// jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
    const cookie = await signin();

    if(!cookie) {
        throw new Error("Cookie not found");
    }

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
        token: "sdf",
        orderId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
    const cookie = await signin();

    if(!cookie) {
        throw new Error("Cookie not found");
    }

    const orderId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: orderId,
        userId: "sdf",
        version: 0,
        price: 20,
        status: OrderStatus.Created,
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
        token: "sdf",
        orderId: order.id,
        })
        .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = await signin(userId);

    if(!cookie) {
        throw new Error("Cookie not found");
    }

    const orderId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: orderId,
        userId: userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled,
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
        token: "sdf",
        orderId: order.id,
        })
        .expect(400);
});

it("returns a 201 with valid inputs", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100);
    const cookie = await signin(userId);

    if(!cookie) {
        throw new Error("Cookie not found");
    }

    const orderId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: orderId,
        userId: userId,
        version: 0,
        price: price,
        status: OrderStatus.Created,
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
        token: "tok_visa",
        orderId: order.id,
        })
        .expect(201);

    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    // expect(chargeOptions.source).toEqual("tok_visa");
    // expect(chargeOptions.amount).toEqual(20 * 100);
    // expect(chargeOptions.currency).toEqual("usd");

    // const chargeOptions = (stripe.paymentIntents.create as jest.Mock).mock.calls[0][0];
    // console.log(chargeOptions);

    const stripeCharges = await stripe.charges.list({limit: 50});
    const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price * 100;
    });
    expect(stripeCharge).toBeDefined();

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id,
    });
    expect(payment).toBeDefined();

});