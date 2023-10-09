const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const couponModel = require("../models/couponSchema");

exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await couponModel.findByIdAndDelete(id);

  if (!coupon) {
    return next(new AppError(`No coupon for this id ${id}`, 404));
  }

  // Trigger "remove" event when update document
  coupon.remove();
  res.status(204).send();
});

exports.updateOne = asyncHandler(async (req, res, next) => {
  const document = await couponModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  if (!document) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404));
  }
  // Trigger "save" event when update document
  document.save();
  res.status(200).json({ data: document });
});

exports.createOne = asyncHandler(async (req, res) => {
  const newDoc = await couponModel.create(req.body);
  res.status(201).json({ data: newDoc });
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await couponModel.findById(id);

  if (!document) {
    return next(new AppError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.getAll = asyncHandler(async (req, res) => {
  const coupons = couponModel.find();

  if (!coupons) {
    return new AppError("no coupon exist", 404);
  }

  res.status(200).json({ data: coupons });
});
