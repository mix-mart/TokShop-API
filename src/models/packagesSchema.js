const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const prodPackages = new mongoose.Schema(
  {
    title: {
        type:String,
        required:true
        
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

prodPackages.pre("save", function (next) {
  // Check if the validity field is not set or if the numberOfProducts has changed
  if (this.plan=='free') {
    // Calculate the validity date based on some logic
    const currentDate = new Date();
    // Calculate the validity date based on your requirements
    currentDate.setDate(currentDate.getDate() + 7);
    this.validity = currentDate
  }
  if (this.plan=='weekly') {
    // Calculate the validity date based on some logic
    const currentDate = new Date();
    // Calculate the validity date based on your requirements
    currentDate.setDate(currentDate.getDate() + 7);
    this.validity = currentDate;
  }

  if (this.plan=='monthly') {
    // Calculate the validity date based on some logic
    const currentDate = new Date();
    // Calculate the validity date based on your requirements
    currentDate.setDate(currentDate.getDate() + 30);
    this.validity = currentDate;
  }
  if (this.plan=='secondary') {
    // Calculate the validity date based on some logic
    const currentDate = new Date();
    // Calculate the validity date based on your requirements
    currentDate.setDate(currentDate.getDate() + 365);
    this.validity = currentDate
  }
  
  next();
});

const prodPackage = model("prodPackage", prodPackages);
module.exports = prodPackage;
