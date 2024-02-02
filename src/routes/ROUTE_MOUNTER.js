const express = require("express");
const nodemailer = require('nodemailer');
const authRouter = require("./authRoutes");
const userRouter = require("./userRoutes");
const orderRouter = require("./orderRoutes");
const shopRouter = require("./shopRoutes");
const productRouter = require("./productRoutes");
const billingRouter = require("./billing");
const addressRouter = require("./address");
const roomRouter = require("./roomRoutes");
const transRouter = require("./transactions");
const subscriptionsRouter = require('./subscriptionsRoute');
const auctionSubscriptionRouter = require('./auctionSubscription');
const activityRouter = require("./activitiesRoute");
const notificationsRouter = require("./notificationRoutes");
const favoriteRouter = require("./favoriteRouter");
const adminRouter = require("./adminRoute");
const recordingRouter = require("./recordingRoute");
const channelRouter = require("./channel");
const interestsRoute = require("./interestsRoute");
const flutterWaveRouter = require("./flutterwave");
const importRouter = require("./import");
const auctionRouter = require("./auction");
const stripeRouter = require("./stripeRoute");
const packageRouter = require("./packageRoute");
const LivePackageRouter = require('./livePackgesRoute')
const coordinatesRouter = require('./coordinatesRoute');
const couponRoute = require('./couponRoute')
const froBlogRoute =require('./froBlogRoute')
const authController = require('../controllers/auth')
const livePackageController = require('../controllers/livePackges');

const uploadVideoRoute = require('./uploadVideoRoute')


const passport = require("passport");
const { getAllActivePackage } = require("../controllers/packages");
const { sendmail, froProtect } = require("../controllers/froBlog");
// const { app } = require("firebase-admin");

require("../services/authenticate");

module.exports= app =express();

app.use("/", authRouter);
app.use("/users", userRouter);
app.use(
  "/orders",
  passport.authenticate("jwt", { session: false }),
  orderRouter
);
app.use("/shop", shopRouter);
app.use("/import", importRouter);
app.use("/events", roomRouter);
app.use("/products", productRouter);
app.use("/channels", channelRouter);
app.use("/interests", interestsRoute);
app.use("/flutterwave", flutterWaveRouter);
app.use("/favorite", favoriteRouter);
app.use("/auction", auctionRouter);
app.use("/stripe", stripeRouter);
app.use("/packages", packageRouter);
app.use('/coupons', couponRoute);
app.use('/froBlog',froBlogRoute);
app.use("/livePackges", LivePackageRouter);
app.get("/is-subscription-valid", authController.protect, livePackageController.isSubscribedToLivePackage);
app.get("/prodPackages/active" , getAllActivePackage);
app.get("/livePackages/active" , livePackageController.getAllActiveLivePackages);
app.use("/videos", uploadVideoRoute);

app.use(
  "/address",
  passport.authenticate("jwt", { session: false }),
  addressRouter
);
app.use(
  "/billing",
  passport.authenticate("jwt", { session: false }),
  billingRouter
);
app.use("/rooms", roomRouter);
// app.use("/rooms", passport.authenticate("jwt", { session: false }), roomRouter);
app.use(
  "/transactions",
  passport.authenticate("jwt", { session: false }),
  transRouter
);
app.use(
  "/subscriptions",

  subscriptionsRouter
);
app.use(
  "/auction-subscriptions",

  auctionSubscriptionRouter
);
app.use("/activities", activityRouter);
app.use(
  "/notifications",
  passport.authenticate("jwt", { session: false }),
  notificationsRouter
);
app.use("/admin", adminRouter);
app.use(
  "/recording",
  passport.authenticate("jwt", { session: false }),
  recordingRouter
);

app.use("/coordinates",
  // passport.authenticate("jwt", { session: false }),
  coordinatesRouter
);



app.post('/receive-email', sendmail);
app.post('/check',froProtect)

