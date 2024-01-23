const productModel = require('../models/productSchema');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


exports.updateProductCoordinates = catchAsync(async (req, res, next) => {
    const productId = req.body.productId;
    const product = await productModel.findById(productId);
    if (!product) {
        return next(new AppError("invalid product id.", 500))
    }
    const { longitude, latitude } = req.body;
    if (!longitude || !latitude) {
        return next(new AppError("you must provide both longitude and latitude.", 500))
    }
    const updatedproduct = await productModel.findByIdAndUpdate(productId, { coordinates: { longitude, latitude } }, { new: true });
    res.status(200).json({
        status: 'success',
        data: {
            updatedproduct
        }
    })
})
exports.getProductCoordinates = catchAsync(async (req, res, next) => {
    const productId = req.body.productId;

   
    const product = await productModel.findById(productId);
    if (!product) {
        return next(new AppError("invalid product id.", 500))
    }
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    })
})