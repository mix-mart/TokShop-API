const mongoose = require("mongoose");
const { Schema, model } = mongoose;



const subscriptionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        packageId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "prodPackage",
        },
        details: {
            type: String,
            required: [true, 'you must provide details about the subscription transaction process.']
        },
        type: {
            type: String,
            enum: ["subscribe", "unsubscribe", "renew"],
            required: [true, 'the transaction must be either of type subscribe, unsubscribe or renew.'],
        },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Failed"],
            required: [true, 'The subscription transaction must have a status either of Pending, Completed or Failed.'],
        },
        deduction: {
            type: Boolean,
            required: [true, 'you must specify wether the subscription transaction has deduction or not.'],
        },
        expiryDate: {
            type: Date,
            required: [true, 'The package must have an expiry Date.']
        },
        stripeBankAccount: {
            type: String,
            required: false,
        },
    },
    { timestamps: true, autoIndex: true, autoCreate: true }
);

const Subscription = model("subscription", subscriptionSchema);

module.exports = Subscription