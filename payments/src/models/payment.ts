import * as mongoose from "mongoose";
/**
 * mongoose-update-if-current is a plugin for Mongoose that increments a version key on updates.
 * This plugin is useful for implementing optimistic concurrency control.
 */
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

// An interface that describes the properties
// that are required to create a new Payment
interface PaymentAttrs {
    orderId: string;
    stripeId: string;
}

// An interface that describes the properties
// that a Payment Document has (Single Payment / Single Database Record)
interface PaymentDoc extends mongoose.Document {
    version: number;
    orderId: string;
    stripeId: string;
}

/**
 * PaymentModel interface extending Mongoose's Model interface.
 * This interface defines a custom static method 'build' for creating
 * new Payment documents in a type-safe manner using TypeScript.
 *
 * An interface that describes the properties that a Payment Model has.
 * By extending mongoose.Model<PaymentDoc>, the PaymentModel inherits all properties and methods of a typical Mongoose model
 *
 * @extends mongoose.Model<PaymentDoc> - Extends the Mongoose Model interface with PaymentDoc.
 * @method build - A static method to create a new Payment instance with the specified attributes.
 * @param {PaymentAttrs} attrs - The attributes required to create a new Payment.
 * @returns {PaymentDoc} - A new instance of the Payment document.
 */
interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

const PaymentSchema = new mongoose.Schema({
    // Version key is handled automatically by the plugin `updateIfCurrentPlugin`
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
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
PaymentSchema.set('versionKey', 'version');
PaymentSchema.plugin(updateIfCurrentPlugin);

/**
 * Solution to Issue#1: Solve the issue of TypeScript not being able to infer the type of the properties of the Order model
 * In Mongoose, statics allows you to add static methods to your schema.
 * Static methods are available on the model (class) itself, rather than on individual instances of the model
 *
 * Static method to create a new Payment instance.
 * This method acts as a factory for creating new Payments
 * and ensures that the passed attributes conform to the PaymentAttrs interface.
 *
 * @param {PaymentAttrs} attrs - The attributes required to create a new Payment.
 * @returns {Payment} A new instance of the Payment model with the specified attributes.
 */
PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
};

const Payment: PaymentModel = mongoose.model<PaymentDoc, PaymentModel>("Payment", PaymentSchema);


export {Payment, PaymentDoc};