const Subscription = require('../models/subscriptionModel');
const Package = require('../models/packagesSchema');
const UserModel = require('../models/userSchema');
const Product = require('../models/productSchema');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const cloudinary = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');


exports.subscribe = catchAsync(async (req, res, next) => {
    // const userId = req.user.id;
    const package = await Package.findById(req.body.packageId);
    const validity = package.validity;


    // const expiryDate = expire?expire:
    const newSub = await Subscription.create({
        packageId: req.body.packageId,
        userId: req.user.id,
        type: req.body.type,
        details: req.body.details,
        status: req.body.status,
        deduction: req.body.deduction,
        stripeBankAccount: req.body.stripeBankAccount,
        expiryDate: new Date((Date.now() + validity * 1000))
    })
    res.status(200).json({
        status: 'success',
        newSub
    })
})
exports.unsubscribe = catchAsync(async (req, res, next) => {
    // const userId = req.user.id;
    const newSub = await Subscription.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: 'success',
        newSub
    })
})

exports.renew = catchAsync(async (req, res, next) => {

})
exports.getAllUserSubscriptions = catchAsync(async (req, res, next) => {
    const packageId = req.params.packageId;
    const userId = req.user.id;
    const subscriptions = await Subscription.find({
        packageId,
        userId
    })
    if (!subscriptions) {
        return new AppError('No Users Subscribed to this package.', 404)
    }
    res.status(200).json({
        status: 'success',
        results: subscriptions.length,
        subscriptions
    })
})
exports.getAllPackageSubscriptions = catchAsync(async (req, res, next) => {
    const packageId = req.params.packageId;

    const subscriptions = await Subscription.find({
        packageId
    })
    if (!subscriptions) {
        return new AppError('No Users Subscribed to this package.', 404)
    }
    res.status(200).json({
        status: 'success',
        results: subscriptions.length,
        subscriptions
    })
})

exports.isSubscriptionValid = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const AllSubscriptions = await Subscription.find({ userId }).sort({ createdAt: -1 });
    console.log(AllSubscriptions)
    if (!AllSubscriptions) return next(new AppError("You are not subscribed to a package yet.please go and subscribe!", 500));
    const lastSubscription = AllSubscriptions[0];
    const packageId = AllSubscriptions[0].packageId;
    const package = await Package.findById(packageId);
    const numberOfProducts = package.numberOfProducts;
    const previousProducts = await Product.find({ ownerId: userId, createdAt: { $gt: lastSubscription.createdAt } });
    const numberOfPreviousProducts = previousProducts.length;
    if (numberOfPreviousProducts >= numberOfProducts) {
        return next(new AppError('You are not allowed to upload more products in that subscription, please go and upgrade your subscription or buy more credits.', 500))
    }
    console.log(AllSubscriptions);
    if (lastSubscription.expiryDate.getTime() < Date.now()) {
        return next(new AppError('Your subscription has been expired! please, go and renew you subscription.', 500))
    }
    if (lastSubscription.status=="Pending") {
        return next(new AppError('Your subscription Pending please wait.', 500))
    }
    if (lastSubscription.status=="Failed") {
        return next(new AppError('Your subscription failed .', 500))
    }
   




    // res.status(200).json(AllSubscriptions)
    res.status(200).json({
        status: "success",
        isAllowed: true,
        message: "you are allowed to add product"
    })

})

exports.updateSubscrip = catchAsync(async (req, res, next) => {
    const document = await Subscription.findByIdAndUpdate(req.params.subscriptionId, req.body, {
      new: true,
    });
  
    if (!document) {
      return next(new AppError(`No document for this id ${req.params.subscriptionId}`, 404));
    }
  
    if (req.file) {
      const uniqueFilename = `subscriptions/${uuidv4()}-${req.file.originalname}`;
  
      // Upload to Cloudinary
      cloudinary.uploader.upload_stream({ 
        resource_type: 'image',
        public_id: uniqueFilename,
      }, async (error, result) => {
        if (error) {
          return next(new AppError('Failed to upload image to Cloudinary', 500));
        }
  
        document.subscripImage = result.secure_url;
        await document.save();
  
        res.status(200).json({ data: document });
      }).end(req.file.buffer);
    } else {
      res.status(200).json({ data: document });
    }
  });