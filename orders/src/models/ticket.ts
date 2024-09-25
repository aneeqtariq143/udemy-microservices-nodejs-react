import * as mongoose from "mongoose";
import {Order, OrderStatus} from "./order";
/**
 * mongoose-update-if-current is a plugin for Mongoose that increments a version key on updates.
 * This plugin is useful for implementing optimistic concurrency control.
 */
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

// An interface that describes the properties
// that are required to create a new Ticket
interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

// An interface that describes the properties
// that a Ticket Document has (Single Ticket / Single Database Record)
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

/**
 * TicketModel interface extending Mongoose's Model interface.
 * This interface defines a custom static method 'build' for creating
 * new Ticket documents in a type-safe manner using TypeScript.
 *
 * An interface that describes the properties that a Ticket Model has.
 * By extending mongoose.Model<TicketDoc>, the TicketModel inherits all properties and methods of a typical Mongoose model
 *
 * @extends mongoose.Model<TicketDoc> - Extends the Mongoose Model interface with TicketDoc.
 * @method build - A static method to create a new Ticket instance with the specified attributes.
 * @param {TicketAttrs} attrs - The attributes required to create a new Ticket.
 * @returns {TicketDoc} - A new instance of the Ticket document.
 */
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null>;
}

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
}, {
    // Transform the JSON representation of the Ticket document
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
TicketSchema.set('versionKey', 'version');
TicketSchema.plugin(updateIfCurrentPlugin);

/**
 * Solution to Issue#1: Solve the issue of TypeScript not being able to infer the type of the properties of the Ticket model
 * In Mongoose, statics allows you to add static methods to your schema.
 * Static methods are available on the model (class) itself, rather than on individual instances of the model
 *
 * Static method to create a new Ticket instance.
 * This method acts as a factory for creating new Tickets
 * and ensures that the passed attributes conform to the TicketAttrs interface.
 *
 * @param {TicketAttrs} attrs - The attributes required to create a new Ticket.
 * @returns {Ticket} A new instance of the Ticket model with the specified attributes.
 */
TicketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
};
TicketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    });
}

TicketSchema.methods.isReserved = async function() {
    // this === the ticket document that we just called 'isReserved' on
    // Run query to look at all orders. Find an order where the ticket
    // is the ticket we just found *and* the orders status is *not* cancelled
    // If we find an order from that means the ticket *is* reserved
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    return !!existingOrder;
};

const Ticket: TicketModel = mongoose.model<TicketDoc, TicketModel>("Ticket", TicketSchema);


export {Ticket, TicketDoc};