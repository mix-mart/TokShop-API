const express = require("express");
const auctionSubscriptionController = require('../controllers/auctionSubscription');
const passport = require("passport");
const authController = require('../controllers/auth');

const auctionSubscriptionsRouter = express.Router();

auctionSubscriptionsRouter.use(authController.protect)
auctionSubscriptionsRouter.route('/').post(auctionSubscriptionController.subscribe).get(auctionSubscriptionController.getAllPackageSubscriptions)
auctionSubscriptionsRouter.route('/:id').delete(auctionSubscriptionController.unsubscribe)
auctionSubscriptionsRouter.route('/:packageId').get(auctionSubscriptionController.getAllUserSubscriptions)
// auctionSubscriptionsRouter.route('/').patch(auctionSubscriptionController.renew)


module.exports = auctionSubscriptionsRouter;
