const UserModel = require('../models/userSchema');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


exports.updateUserCoordinates = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { longitude, latitude } = req.body;
    if (!longitude || !latitude) {
        return next(new AppError("you must provide both longitude and latitude.", 500))
    }
    const updatedUser = await UserModel.findByIdAndUpdate(userId, { coordinates: { longitude, latitude } });
    res.status(200).json({
        status: 'success',
        data: {
            updatedUser
        }
    })
})
exports.getUserCoordinates = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    if (!userId) {
        return next(new AppError("you must login first.", 500))
    }
    const user = await UserModel.findById(userId);
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})