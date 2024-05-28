const express = require("express");
const auctionSubscriptionController = require('../controllers/auctionSubscription');
const passport = require("passport");
const authController = require('../controllers/auth');
const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });




const auctionSubscriptionsRouter = express.Router();

// auctionSubscriptionsRouter.use(authController.protect)
auctionSubscriptionsRouter.route('/').post(authController.protect,auctionSubscriptionController.subscribe)
auctionSubscriptionsRouter.route('/:id').delete(authController.protect,auctionSubscriptionController.unsubscribe)
auctionSubscriptionsRouter.route('/:packageId').get(authController.protect,auctionSubscriptionController.getAllUserSubscriptions)
auctionSubscriptionsRouter.route('/AllSubscription/:packageId').get(auctionSubscriptionController.getAllPackageSubscriptions)
// auctionSubscriptionsRouter.route('/').patch(auctionSubscriptionController.renew)
auctionSubscriptionsRouter.route('/updateLiveSubscription/:subscriptionId').put(upload.single("subscripImage"),auctionSubscriptionController.updateLiveSubscrip)

module.exports = auctionSubscriptionsRouter;
