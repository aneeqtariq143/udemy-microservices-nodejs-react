import * as mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties
// that a User Document has (Single User / Single Database Record)
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * UserModel interface extending Mongoose's Model interface.
 * This interface defines a custom static method 'build' for creating
 * new user documents in a type-safe manner using TypeScript.
 *
 * An interface that describes the properties that a User Model has.
 * By extending mongoose.Model<UserDoc>, the UserModel inherits all properties and methods of a typical Mongoose model
 *
 * @extends mongoose.Model<UserDoc> - Extends the Mongoose Model interface with UserDoc.
 * @method build - A static method to create a new user instance with the specified attributes.
 * @param {UserAttrs} attrs - The attributes required to create a new user.
 * @returns {UserDoc} - A new instance of the User document.
 */
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
})

/**
 * Solution to Issue#1: Solve the issue of TypeScript not being able to infer the type of the properties of the User model
 * In Mongoose, statics allows you to add static methods to your schema.
 * Static methods are available on the model (class) itself, rather than on individual instances of the model
 *
 * Static method to create a new User instance.
 * This method acts as a factory for creating new users
 * and ensures that the passed attributes conform to the UserAttrs interface.
 *
 * @param {UserAttrs} attrs - The attributes required to create a new user.
 * @returns {User} A new instance of the User model with the specified attributes.
 */
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);


export {User};