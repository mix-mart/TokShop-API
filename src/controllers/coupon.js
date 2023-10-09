const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const couponModel = require("../models/couponSchema");
const package=require('../models/packagesSchema')

exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await couponModel.findByIdAndDelete(id);

  if (!coupon) {
    return next(new AppError(`No coupon for this id ${id}`, 404));
  }

  // Trigger "remove" event when update document
  coupon.remove();
  res.status(204).send();
});

exports.updatecoupon = asyncHandler(async (req, res, next) => {
  const document = await couponModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  if (!document) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404));
  }
  // Trigger "save" event when update document
  document.save();
  res.status(200).json({ data: document });
});

exports.createcoupon = asyncHandler(async (req, res) => {
  const newDoc = await couponModel.create(req.body);
  res.status(201).json({ data: newDoc });
});

exports.getcoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await couponModel.findById(id);

  if (!document) {
    return next(new AppError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.getAllcoupon = asyncHandler(async (req, res) => {
  const coupons =await couponModel.find();

  if (!coupons) {
    return new AppError("no coupon exist", 404);
  }

  res.status(200).json({ data: coupons });
});




exports.applyCoupon = asyncHandler(async (req, res, next) => {
    // 1) Get coupon based on coupon name
    const coupon = await couponModel.findOne({
      name: req.body.coupon,
      expire: { $gt: Date.now() },
    });
 
    if (!coupon) {
      return next(new AppError(`Coupon is invalid or expired`));
    }
  
    // 2) Get package to get total package price
    const Package = await package.findById(req.body.packageId );
 
    const totalPrice = Package.price;
  
    // 3) Calculate price after priceAfterDiscount
    const totalPriceAfterDiscount = (
      totalPrice -
      (totalPrice * coupon.discount) / 100
    ).toFixed(2); // 99.23
  
    Package.priceAfterDiscount = totalPriceAfterDiscount;
    await Package.save();
  
    res.status(200).json({
      status: 'success',
      data: Package,
    });
  });
