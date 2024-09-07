import * as mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new Ticket
interface TicketAttrs {
    title: string;
    price: number;
    userId: string
}

// An interface that describes the properties
// that a Ticket Document has (Single Ticket / Single Database Record)
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * TicketModel interface extending Mongoose's Model interface.
 * This interface defines a custom static method 'build' for creating
 * new ticket documents in a type-safe manner using TypeScript.
 *
 * An interface that describes the properties that a Ticket Model has.
 * By extending mongoose.Model<TicketDoc>, the TicketModel inherits all properties and methods of a typical Mongoose model
 *
 * @extends mongoose.Model<TicketDoc> - Extends the Mongoose Model interface with TicketDoc.
 * @method build - A static method to create a new ticket instance with the specified attributes.
 * @param {TicketAttrs} attrs - The attributes required to create a new ticket.
 * @returns {TicketDoc} - A new instance of the Ticket document.
 */
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    // Transform the JSON representation of the Ticket document
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

// ticketSchema.pre('save', async function (done) {
//     if (this.isModified('password')) {
//         const hashed = await Password.toHash(this.get('password'));
//         this.set('password', hashed);
//     }
//     done();
// })

/**
 * Solution to Issue#1: Solve the issue of TypeScript not being able to infer the type of the properties of the Ticket model
 * In Mongoose, statics allows you to add static methods to your schema.
 * Static methods are available on the model (class) itself, rather than on individual instances of the model
 *
 * Static method to create a new Ticket instance.
 * This method acts as a factory for creating new Tickets
 * and ensures that the passed attributes conform to the TicketAttrs interface.
 *
 * @param {TicketAttrs} attrs - The attributes required to create a new ticket.
 * @returns {Ticket} A new instance of the Ticket model with the specified attributes.
 */
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket: TicketModel = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);


export {Ticket, TicketDoc};