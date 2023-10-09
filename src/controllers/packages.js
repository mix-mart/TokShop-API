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

exports.getPackage=async(req,res,next)=>{
   try{
    const package=await prodPackage.findById({_id:req.params.id})
    if(!package){
        return next(new AppError('package not found.', 404)) 
    }
    res.status(200).json({ success: true,package})
   }catch(err){
    return next(new AppError('package not found.', 404)) 
   }
}

exports.getAllPackage=async(req,res,next)=>{
    try{
        const packages =await prodPackage.find();
    // console.log(packages)
    if(!packages){
        return next(new AppError('packages not found.', 404)) 
    }
    res.status(200).json({success: true,data:packages})
    }catch(err){
        return next(new AppError('packages not found.', 404)) 
    }
}
exports.updatePackage=async(req,res)=>{
try{
    const updated=await prodPackage.findByIdAndUpdate(req.params.id,req.body,
        {new:true})
    if(!updated){
        return next( new AppError('packages not found.', 404))
    }
    res.status(200).json({success: true,data:updated})
}catch(err){
    return next( new AppError('packages not found.', 404))
}
}

exports.deletePackage = async (req, res, next) => {
    const { id } = req.params;
  
    try {
      const deleted = await prodPackage.findByIdAndDelete(id);
  
      if (!deleted) {
        return next(new AppError('Package not found.', 404));
      }
  
      res.status(200).json({ success: true, deleted });
    } catch (err) {
      next(new AppError('Package not found.', 404)); // Pass any errors to the error-handling middleware
    }
  };
