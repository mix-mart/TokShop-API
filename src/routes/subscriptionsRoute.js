const express = require("express");
const subscriptionController = require('../controllers/subscription');
const passport = require("passport");
const authController = require('../controllers/auth');

const subscriptionsRouter = express.Router();

subscriptionsRouter.use(authController.protect)
subscriptionsRouter.route('/').post(subscriptionController.subscribe)
subscriptionsRouter.route('/:id').delete(subscriptionController.unsubscribe)
// subscriptionsRouter.route('/').patch(subscriptionController.renew)

module.exports = subscriptionsRouter;
