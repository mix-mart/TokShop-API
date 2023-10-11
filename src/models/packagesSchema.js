const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const prodPackages = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    priceAfterDiscount: {
      type: Number,
      // required:true,
    },
    numberOfProducts: {
      type: Number,
      required: true,
    },
    discription: String,
    validity: {
      type: Number,
      // required:[true,'expire date required']
    },
    plan: {
      type: String,
      enum: ["free", "weekly", "monthly", "secondary"],
      default: "free",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    country:String,

  },
  { timestamps: true, autoCreate: true, autoIndex: true }
);

prodPackages.pre("save", function (next) {
  if (this.plan == "free") {
    const currentDate = 7 * 24 * 60 * 60;
    //currentDate.setDate(currentDate.getDate() + 7);
    this.validity = currentDate;
  }
  if (this.plan == "weekly") {
    // const currentDate = new Date();
    const currentDate = 7 * 24 * 60 * 60;
    // currentDate.setDate(currentDate.getDate() + 7);
    this.validity = currentDate;
  }

  if (this.plan == "monthly") {
    // const currentDate = new Date();
    const currentDate = 30 * 24 * 60 * 60;
    // currentDate.setDate(currentDate.getDate() + 30);
    this.validity = currentDate;
  }
  if (this.plan == "secondary") {
    // const currentDate = new Date();
    const currentDate = 365 * 24 * 60 * 60;
    // currentDate.setDate(currentDate.getDate() + 365);
    this.validity = currentDate;
  }

  next();
});

const prodPackage = model("prodPackage", prodPackages);
module.exports = prodPackage;
