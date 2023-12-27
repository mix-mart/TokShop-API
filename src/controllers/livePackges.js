const express = require('express');
const livePackges = require("../models/livePackageSchema");
const auctionSubscription = require('../models/auctionSubscription');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const couponModel = require('../models/couponSchema');
const catchAsync = require('../utils/catchAsync');
const Subscription = require('../models/subscriptionModel');


exports.createLivePackage = async (req, res) => {
  try {
    const package = new livePackges(req.body);
    await package.save();
    res.status(201).json(package);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllLivePackages = async (req, res) => {
  try {
    const packages = await livePackges.find();
    res.status(200).json({ result: packages.length, Data: packages });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllActiveLivePackages = async (req, res) => {
  try {
    const packages = await livePackges.find({isActive: true});
    res.status(200).json({ result: packages.length, Data: packages });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSpcificLivePackge = async (req, res) => {
  try {
    const package = await livePackges.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.status(200).json(package);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.updateLivepackage = async (req, res) => {
//   try {
//     const package = await livePackges.findByIdAndUpdate(req.params.id, req.body, {
//       new: true, // Return the updated package
//     });
//     if (!package) {
//       return res.status(404).json({ error: 'Package not found' });
//     }
//     res.status(200).json(package);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.updateLivePackage = async (req, res) => {
  try {
    const updatedPackage = await livePackges.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
    });
    if (!updatedPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.status(200).json(updatedPackage);
  } catch (error) {
   
    if (error.name === 'ValidationError') {
      return res.status(422).json({ error: error.message });
    }
    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.deleteLivePackages = async (req, res) => {
  try {
    const package = await livePackges.findByIdAndRemove(req.params.id);
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.status(204).send(); // No content, successful deletion
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.apllayCouponOnLivePackge = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new AppError(`Coupon is invalid or expired`));
  }

  // 2) Get package to get total package price
  const Package = await auctionSubscription.findById(req.body.liveSubId);

  const totalPrice = Package.totalPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23
  Package.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await Package.save();

  res.status(200).json({
    status: 'success',
    data: Package,
  });
});
exports.isSubscribedToLivePackage = catchAsync(async (req, res, next) => {

  console.log(req.user)
  const userId = req.user.id;
  const AllSubscriptions = await auctionSubscription.find({ userId }).sort({ createdAt: -1 });
  console.log(!AllSubscriptions)
  if (AllSubscriptions.length === 0) return next(new AppError("You are not subscribed to a package yet.please go and subscribe!", 500));

  res.status(200).json({
    status: "success",
    isAllowed: true,
    message: "You are allowed to continue using the live feature."
  })
})