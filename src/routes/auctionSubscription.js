const express = require("express");
const auctionSubscriptionController = require('../controllers/auctionSubscription');
const passport = require("passport");
const authController = require('../controllers/auth');

const auctionSubscriptionsRouter = express.Router();

// auctionSubscriptionsRouter.use(authController.protect)
auctionSubscriptionsRouter.route('/').post(authController.protect,auctionSubscriptionController.subscribe)
auctionSubscriptionsRouter.route('/:id').delete(authController.protect,auctionSubscriptionController.unsubscribe)
auctionSubscriptionsRouter.route('/:packageId').get(authController.protect,auctionSubscriptionController.getAllUserSubscriptions)
auctionSubscriptionsRouter.route('/AllSubscription/:packageId').get(auctionSubscriptionController.getAllPackageSubscriptions)
// auctionSubscriptionsRouter.route('/').patch(auctionSubscriptionController.renew)


module.exports = auctionSubscriptionsRouter;
