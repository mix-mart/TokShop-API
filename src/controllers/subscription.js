const Subscription = require('../models/subscriptionModel');
const catchAsync = require('../utils/catchAsync');

exports.subscribe = catchAsync(async (req, res, next) => {
    // const userId = req.user.id;
    const newSub = await Subscription.create({
        packageId: req.body.packageId,
        userId: req.user.id,
        type: req.body.type,
        details: req.body.details,
        status: req.body.status,
        deduction: req.body.deduction,
        stripeBankAccount: req.body.stripeBankAccount,
        expiryDate: Date.now()
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