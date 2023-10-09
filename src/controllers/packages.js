const mongoose = require("mongoose");
const prodPackage=require('../models/packagesSchema');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');

exports.createPackage=asyncHandler(async(req,res)=>{
    const newPackage=await prodPackage.create({
        title:req.body.title,
        price:req.body.price,
        numberOfProducts:req.body.numberOfProducts,
        plan:req.body.plan,
    })

    res.status(201).json({ success: true,data:newPackage});
})

exports.getPackage=asyncHandler(async(req,res)=>{
    const package=await prodPackage.findById({_id:req.params.id})
    if(!package){
        return new AppError('package not found.', 404)
    }
    res.status(200).json({ success: true,package})
})
exports.getAllPackage=asyncHandler(async(req,res)=>{
    const packages =await prodPackage.find();
    // console.log(packages)
    if(!packages){
        return new AppError('packages not found.', 404)
    }
    res.status(200).json({success: true,data:packages})
})

exports.deletePackage=asyncHandler(async(req,res)=>{
    const{id}=req.params
    const deleted=await prodPackage.findByIdAndDelete(id)
console.log(deleted)
    if(!deleted){
        return new AppError('package not found.', 404)
    }
    res.status(200).json({success: true,deleted})
})