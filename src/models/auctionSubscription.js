const { subscribe } = require("diagnostics_channel");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;



const auctionSubscriptionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        packageId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Package",
        },
        details: {
            type: String,
            required: [true, 'you must provide details about the subscription transaction process.']
        },
        subscripImage: {
            type: String,
          },
          phone: {
            type: Number,
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
            default:"Pending"
        },
        deduction: {
            type: Boolean,
            required: [true, 'you must specify wether the subscription transaction has deduction or not.'],
        },
        expiryDate: {
            type: Date,
            // required: [true, 'The package must have an expiry Date.']
        },
        stripeBankAccount: {
            type: String,
            required: false,
        },
        numberOfMinutes: {
            type: Number,
            required: [true, 'the subscription must contain the number of minutes.']
        },
        usedMinutes: {
            type: Number,
            required: [true, 'the subscription must have used minutes.']
        },
        totalPrice: {
            type: Number,
            required: [true, 'the subscription must contain total price.']
        },
        totalPriceAfterDiscount:Number,
    },
    { timestamps: true, autoIndex: true, autoCreate: true }
);

// Populate user's name when querying subscriptions
auctionSubscriptionSchema.pre('find', function(next) {
    this.populate('userId', 'firstName'); 
    next();
});


const auctionSubscription = model("AuctionSubscription", auctionSubscriptionSchema);

module.exports = auctionSubscription