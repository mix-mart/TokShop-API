const userModel = require("../models/userSchema");
const users = require("../models/userSchema");
const passport = require("passport");
const { promisify } = require('util');
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
var admin = require("firebase-admin");
const serviceAccount = require("../../service_account.json");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const { token } = require("morgan");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

admin.firestore().settings({ ignoreUndefinedProperties: true });

require("dotenv").config({ path: `${__dirname}/../../.env` });

exports.checUserExistsByEmail = async (req, res, next) => {
  console.log(req.body);
  const user = await userModel.find({ email: req.body.email });
  if (user.length > 0) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
};

exports.mobileLoginRegisterWithSocial = async (req, res, next) => {
  const user = await userModel
    .find({ email: req.body.email })
    .populate("shopId")
    .populate("following", [
      "firstName",
      "lastName",
      "bio",
      "userName",
      "email",
      "accountDisabled",
    ])
    .populate("followers", [
      "firstName",
      "lastName",
      "bio",
      "userName",
      "email",
      "accountDisabled",
    ])
    .populate("defaultpaymentmethod")
    .populate("payoutmethod")
    .populate({
      path: "shopId",
      populate: {
        path: "userId",
      },
    })
    .populate({
      path: "address",
      populate: {
        path: "userId",
      },
    })
    .populate({
      path: "address",
      populate: {
        path: "userId",
      },
    })
    .populate("channel")
    .populate("interest");
  if (user.length > 0) {
    console.log("one", user[0]);
	  const apptoken = createtoken(user[0]._id);
 admin
      .auth()
      .createCustomToken(user[0]._id.toString())
      .then(async (customToken) => {
        const token = jwt.sign(user[0].email, process.env.secret_key);
        res.status(200).json({
          authtoken: customToken,
          success: true,
          data: user[0],
          accessToken: token,
          newuser: false,
apptoken:apptoken
        });
      })
      .catch((error) => {
        res.status(400).json({ success: false });
      });
  } else {
    let added = await userModel.create(req.body);
    added
      .populate("shopId")
      .populate("following", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "accountDisabled",
      ])
      .populate("followers", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "accountDisabled",
      ])
      .populate("defaultpaymentmethod")
      .populate("payoutmethod")
      .populate({
        path: "address",
        populate: {
          path: "userId",
        },
      })
      .populate({
        path: "address",
        populate: {
          path: "userId",
        },
      })
      .populate("channel")
      .populate("interest");
    console.log("added ", added); 
const apptoken = createtoken(added._id);
    admin
      .auth()
      .createCustomToken(added._id.toString())
      .then(async (customToken) => {
        const token = jwt.sign(added.email, process.env.secret_key);

        res.status(200).json({
          authtoken: customToken,
          success: true,
          data: added,
          accessToken: token,
          newuser: true,
apptoken:apptoken
        });
      })
      .catch((error) => {
        res.status(400).json({ success: false });
      });
  }
};
exports.adminLoginWithSocial = async (req, res, next) => {
  const user = await userModel.find({ email: req.body.email });
  if (user.length > 0 && user[0].shopId != null) {
    console.log(user);
    if (req.body.type == "apple" || req.body.type == "google") {
      admin
        .auth()
        .createCustomToken(user[0]._id.toString())
        .then(async (customToken) => {
          const token = jwt.sign(user[0].email, process.env.secret_key);

          res.status(200).json({
            authtoken: customToken,
            success: true,
            data: user[0],
            accessToken: token,
          });
        })
        .catch((error) => {
          res.status(400).json(null);
        });
    } else {
      res
        .status(422)
        .setHeader("Content-Type", "application/json")
        .json({ success: false, info: { message: "email already exists" } });
    }
  } else {
    console.log("error");
    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json({ success: false, info: { message: "you dont have a shop" } });
  }
};

exports.authenticate = (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err || !user) {
      console.log("err", err);
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, info });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        console.log("error", error);
        return res
          .status(422)
          .setHeader("Content-Type", "application/json")
          .json(error.message);
      } else if (user && !error) {
        admin
          .auth()
          .createCustomToken(info._id.toString())
          .then((customToken) => {
            // Send token back to client
            const token = jwt.sign(info.email, process.env.secret_key);
            res.status(200).json({
              authtoken: customToken,
              success: true,
              data: info,
              accessToken: token,
            });
          })
          .catch((error) => {
            console.log("Error creating custom token:", error);
            res.status(400).json(null);
          });
      }
    });
  })(req, res, next);
};

const createtoken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.protect = asyncHandler(async (req, res, next) => {
  //1:check if token exist
  //console.log(req.headers)
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.JWT) {
    token = req.cookies.JWT;
  }
  if (!token) {
    return next(
      new AppError("you are not login to get acsses this route", 401)
    );
  }

  //2:verfiy token(change happen ,expired token)

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // req.user = decoded;
  // console.log(decoded)
  //2:check if user exist
  const curentUser = await userModel.findById(decoded.userId);

  if (!curentUser) {
    return next(
      new AppError(
        "THE USER THAT BELONG TO THIS TOKEN DOSENT LONGER EXSIST",
        401
      )
    );
  }
  //check if user change his pass after token created
  if (curentUser.passwordChangedAt) {
    const passChangedTimeStamp = parseInt(
      curentUser.passwordChangedAt.getTime() / 100,
      10
    );
    if (passChangedTimeStamp > decoded.iat) {
      return next(new AppError("user resntly changed his password", 401));
    }
  }
  req.user = curentUser;
  next();
  //
});

exports.signUp = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const user = await userModel.findOne({
    userName: req.body.userName
  })
  if (user) return next(new AppError('you are already signed up before, go and login', 500));
  const newUser = await userModel.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    password: req.body.password,
    email: req.body.email,
  });

  const token = createtoken(newUser._id);

  res.status(201).json({ data: newUser, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  
  const User = await userModel.findOne({ userName: req.body.userName });

  if (!User || !(await bcrypt.compare(req.body.password, User.password))) {
    return next(new AppError("incorect usrName or password", 401));
  }

        const accesstoken = jwt.sign(User.email, process.env.secret_key);

//  console.log("one", User._id);
  
//const token = createtoken(User._id);

  //res.status(200).json({ data: User, token,accesstoken });

const token = createtoken(User._id);
admin
      .auth()
      .createCustomToken(User._id.toString())
      .then(async (customToken) => {
        const accessToken = jwt.sign(User.email, process.env.secret_key);

        res.status(200).json({
          authtoken: customToken,
          success: true,
          data: User,
          accessToken: accessToken,
          newuser: false,
apptoken:token
        });
      })
      .catch((error) => {
        res.status(400).json({ success: false });
      });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("There is no user with such email address!!", 404)
    );
  }


    // 2) If user exist, Generate hash reset random 6 digits and save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');


        // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();
  // const resetToken = await user.createPasswordResetToken();
  // const hashedToken = crypto
  //   .createHash('sha256')
  //   .update(resetToken)
  //   .digest('hex');
  // await user.save({ validateBeforeSave: false });

  //FIXME:
  try {
    // const resetURL = `${req.protocol}://${req.get(
    //   "host"
    // )}/users/reset-password/${resetToken}`;
    await new Email(user, resetCode).sendPasswordReset(res);
    res.status(200).json({
      status: "success",
      message: "reset token sent to your email",
      // resetToken,
      // resetCode,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError(
        "There was an error sending the email , Try again Later! ",
        500
      )
    );
  }
});

exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const user = await userModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Reset code invalid or expired',500));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: 'Success',
  });
});


exports.changePassword = asyncHandler(async (req, res, next) => {
  // Get the logged-in user's ID from the JWT token
  const userId = req.user.id;

  // Find the user by ID
  const user = await userModel.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Check if the provided current password matches the stored password
  const isCurrentPasswordValid = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    return next(new AppError("Current password is incorrect", 400));
  }

  // Hash the new password
  // const newPasswordHash = await bcrypt.hash(req.body.newPassword, 12);

  // Update the user's password
  user.password = req.body.newPassword;


  await user.save();

  // Send a success response
  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(`There is no user with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new AppError('Reset code not verified', 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createtoken(user._id);
  res.status(200).json({ token });
});
