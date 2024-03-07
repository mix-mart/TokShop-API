const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/users");
// subscriptionController.isSubscriptionValid
const subscriptionController = require('../controllers/subscription');
const authController = require('../controllers/auth');
const passport = require("passport");

require("../services/authenticate");

const multer = require("multer");
const { login, signUp } = require("../controllers/auth");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });

userRouter
  .route(`/`)
  .get(
    passport.authenticate("jwt", { session: false }),
    userController.getAllUsers
  )
  .post(upload.single("profilePicture"), userController.addUser);

userRouter
  .route(`/allusers`)
  .get(
    passport.authenticate("jwt", { session: false }),
    userController.getAllTheUsers
  );

userRouter
  .route("/:userId")
  .get(
    passport.authenticate("jwt", { session: false }),
    userController.getUserById
  )
  .put(upload.single("profilePhoto"), userController.editUserById)
  .delete(
    passport.authenticate("jwt", { session: false }),
    userController.deleteUserById
  );

userRouter
  .route("/withdraw/requests")
  .get(userController.getAllWithdraws)
  .post(userController.withdraw);

userRouter
  .route("/withdraw/requests/:withdrawId")
  .get(userController.getWithdrawById)
  .put(userController.updateWithdraw)
  .delete(userController.deleteWithdraw);

userRouter
  .route("/followers/:userId")
  .get(
    passport.authenticate("jwt", { session: false }),
    userController.userFollowers
  );

userRouter
  .route("/followersfollowing/:userId")
  .get(
    passport.authenticate("jwt", { session: false }),
    userController.userFollowersFollowing
  );

userRouter
  .route("/followersfollowing/search/:userId/:name")
  .get(
    passport.authenticate("jwt", { session: false }),
    userController.searchForUserFriends
  );

userRouter
  .route("/following/:userId")
  .get(
    passport.authenticate("jwt", { session: false }),
    userController.userFollowing
  );

userRouter
  .route("/upgrade/:userId")
  .put(
    passport.authenticate("jwt", { session: false }),
    userController.upgradeAccount
  );

userRouter
  .route("/follow/:myUid/:toFollowUid")
  .put(
    passport.authenticate("jwt", { session: false }),
    userController.followUser
  );

userRouter
  .route("/block/:myUid/:toBlockUid")
  .put(
    passport.authenticate("jwt", { session: false }),
    userController.blockUser
  );

userRouter
  .route("/unblock/:myUid/:toBlockUid")
  .put(
    passport.authenticate("jwt", { session: false }),
    userController.unblockUser
  );

userRouter
  .route("/unfollow/:myUid/:toFollowUid")
  .put(
    passport.authenticate("jwt", { session: false }),
    userController.unFollowUser
  );

userRouter
  .route("/updateWallet/:userId")
  .put(
    passport.authenticate("jwt", { session: false }),
    userController.updateWallet
  );

userRouter
  .route("/agora/:agoraid")
  .get(
    passport.authenticate("jwt", { session: false }),
    userController.getUserByAgora
  );

userRouter
  .route("/profile/summary/:shopid")
  .get(
    passport.authenticate("jwt", { session: false }),
    userController.getProfileSummary
  );

userRouter
  .route("/paymentmethod/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    userController.getPaymentmethodByUserId
  )

  .post(
    passport.authenticate("jwt", { session: false }),
    userController.createPaymentMethod
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    userController.deletePaymentmethod
  );

userRouter
  .route("/payoutmethod/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    userController.getPayoutmethodByUserId
  )

  .post(
    passport.authenticate("jwt", { session: false }),
    userController.createPayoutMethod
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    userController.deletePayoutmethod
  );
userRouter.route("/review/:id").post(userController.addUserReview);
userRouter.route("/review/:id").get(userController.getUserReviews);
userRouter.route("/canreview/:id").post(userController.checkCanReview);
userRouter.route("/updateIp/:id").post(userController.updateIP);

userRouter
  .route("/review/delete/review/:id")
  .delete(userController.deleteUserReviewsById);

userRouter
  .route("/updateinterests/:id")
  .put(userController.updateUserInterests);
// userRouter.route('/signup').post(signUp); 
userRouter.route("/login").post(login)

userRouter.route('/signup').post(authController.signUp);
userRouter.route('/forgot-my-password').post(authController.forgotPassword)
userRouter.post('/verifyResetCode', authController.verifyPassResetCode);
userRouter.route('/update/password').put(authController.protect, authController.changePassword)

// Route for resetting password using the reset token
userRouter.post('/reset-password', authController.resetPassword);
// userRouter.post("/is-subscription-valid/", authController.protect, subscriptionController.isSubscriptionValid);


module.exports = userRouter;
