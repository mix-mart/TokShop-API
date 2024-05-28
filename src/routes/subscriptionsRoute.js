const express = require("express");
const subscriptionController = require('../controllers/subscription');
const passport = require("passport");
const authController = require('../controllers/auth');
const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });




const subscriptionsRouter = express.Router();

// subscriptionsRouter.use(authController.protect)
subscriptionsRouter.route('/').post(authController.protect,subscriptionController.subscribe).get(subscriptionController.getAllPackageSubscriptions)
subscriptionsRouter.route('/:id').delete(authController.protect,subscriptionController.unsubscribe)
subscriptionsRouter.route('/:packageId').get(authController.protect,subscriptionController.getAllUserSubscriptions)
subscriptionsRouter.route('/').patch(authController.protect,subscriptionController.renew)
subscriptionsRouter.route('/AllSubscription/:packageId').get(subscriptionController.getAllPackageSubscriptions)
subscriptionsRouter.route('/updateSubscription/:subscriptionId')
.put(
  upload.single("subscripImage"),
  passport.authenticate("jwt", { session: false }),
  subscriptionController.updateSubscrip)
module.exports = subscriptionsRouter;
