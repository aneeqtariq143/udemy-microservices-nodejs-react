import * as mongoose from "mongoose";
import {OrderStatus} from "@atgitix/common";
/**
 * mongoose-update-if-current is a plugin for Mongoose that increments a version key on updates.
 * This plugin is useful for implementing optimistic concurrency control.
 */
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

export {OrderStatus};

// An interface that describes the properties
// that are required to create a new Order
interface OrderAttrs {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

// An interface that describes the properties
// that an Order Document has (Single Order / Single Database Record)
interface OrderDoc extends mongoose.Document {
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
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
    findByEvent(event: {id: string, version: number}): Promise<OrderDoc | null>;
}

const OrderSchema = new mongoose.Schema({
    // Version key is handled automatically by the plugin `updateIfCurrentPlugin`
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    }
}, {
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
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        userId: attrs.userId,
        price: attrs.price,
        status: attrs.status
    });
};
OrderSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Order.findOne({
        _id: event.id,
        version: event.version - 1
    });
}

const Order: OrderModel = mongoose.model<OrderDoc, OrderModel>("Order", OrderSchema);


export {Order, OrderDoc};