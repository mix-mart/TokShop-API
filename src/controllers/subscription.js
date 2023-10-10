const Subscription = require('../models/subscriptionModel');
const Package = require('../models/packagesSchema');
const UserModel = require('../models/userSchema');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
    const packageId = req.body.packageId;

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