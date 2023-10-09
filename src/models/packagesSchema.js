const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const prodPackages = new mongoose.Schema(
  {
    title: {
        type:String,
        
    },
    price: {
        type:Number,
        required:true,
    },
    priceAfterDiscount: {
        type:Number,
        // required:true,
    },
    numberOfProducts: {
        type:Number,
        required:true,
    },
    discription: String,
    validity:{
        type:Date,
        // required:[true,'expire date required']
    },
    plan:{
        type:String,
        enum:['free','weekly','monthly','secondary'],
        default:'free',

    },

    userIds: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
      },
    ],


  },
  { timestamps: true, autoCreate: true, autoIndex: true }
);

const prodPackage = model("prodPackage", prodPackages);
module.exports = prodPackage;
