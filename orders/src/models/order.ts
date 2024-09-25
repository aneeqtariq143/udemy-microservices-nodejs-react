import * as mongoose from "mongoose";
import {OrderStatus} from "@atgitix/common";
import {TicketDoc} from "./ticket";
/**
 * mongoose-update-if-current is a plugin for Mongoose that increments a version key on updates.
 * This plugin is useful for implementing optimistic concurrency control.
 */
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

export {OrderStatus};

// An interface that describes the properties
// that are required to create a new Order
interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

// An interface that describes the properties
// that an Order Document has (Single Order / Single Database Record)
interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    createdAt: Date;
    updatedAt: Date;
    version: number;
}

/**
 * OrderModel interface extending Mongoose's Model interface.
 * This interface defines a custom static method 'build' for creating
 * new Order documents in a type-safe manner using TypeScript.
 *
 * An interface that describes the properties that a Order Model has.
 * By extending mongoose.Model<OrderDoc>, the OrderModel inherits all properties and methods of a typical Mongoose model
 *
 * @extends mongoose.Model<OrderDoc> - Extends the Mongoose Model interface with OrderDoc.
 * @method build - A static method to create a new Order instance with the specified attributes.
 * @param {OrderAttrs} attrs - The attributes required to create a new Order.
 * @returns {OrderDoc} - A new instance of the Order document.
 */
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    // Enable automatic createdAt and updatedAt fields
    timestamps: true,  // This option adds `createdAt` and `updatedAt` fields

    // Transform the JSON representation of the Order document
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
/**
 * Below two is a configuration to increment the version key on updates.
 * Configure to track `version` key instead of `__v`.
 */
OrderSchema.set('versionKey', 'version');
OrderSchema.plugin(updateIfCurrentPlugin);

/**
 * Solution to Issue#1: Solve the issue of TypeScript not being able to infer the type of the properties of the Order model
 * In Mongoose, statics allows you to add static methods to your schema.
 * Static methods are available on the model (class) itself, rather than on individual instances of the model
 *
 * Static method to create a new Order instance.
 * This method acts as a factory for creating new Orders
 * and ensures that the passed attributes conform to the OrderAttrs interface.
 *
 * @param {OrderAttrs} attrs - The attributes required to create a new Order.
 * @returns {Order} A new instance of the Order model with the specified attributes.
 */
OrderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};

const Order: OrderModel = mongoose.model<OrderDoc, OrderModel>("Order", OrderSchema);


export {Order, OrderDoc};