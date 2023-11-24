const express = require("express");
const subscriptionController = require('../controllers/subscription');
const passport = require("passport");
const authController = require('../controllers/auth');

const subscriptionsRouter = express.Router();

// subscriptionsRouter.use(authController.protect)
subscriptionsRouter.route('/').post(authController.protect,subscriptionController.subscribe).get(subscriptionController.getAllPackageSubscriptions)
subscriptionsRouter.route('/:id').delete(authController.protect,subscriptionController.unsubscribe)
subscriptionsRouter.route('/:packageId').get(authController.protect,subscriptionController.getAllUserSubscriptions)
subscriptionsRouter.route('/').patch(authController.protect,subscriptionController.renew)
subscriptionsRouter.route('/AllSubscription/:packageId').get(subscriptionController.getAllPackageSubscriptions)

module.exports = subscriptionsRouter;
