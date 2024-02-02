const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const path = require('path');
const froBlog = require("../models/froblogModel");
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');


cloudinary.config({
  cloud_name: 'dglkluhsv',
  api_key: '922759547547834',
  api_secret: 'OhaE-AjZSdXPnXBq1UmWH-5c-EM'
});


exports.createFroBlog = asyncHandler(async (req, res, next) => {
  try {
    const blog = await froBlog.create(req.body);
    if (!blog) {
      return next(new AppError(`Error while creating blog`, 404));
    }

    const uploadedFile = req.file;
    if (!uploadedFile) {
      return next(new AppError(`Blog image required`, 404));
    }

    if (!uploadedFile.originalname || !uploadedFile.buffer || !uploadedFile.mimetype) {
      console.error('Invalid file object:', uploadedFile);
      return next(new AppError('Invalid file object', 400));
    }

    // Convert the buffer to a readable stream
    const bufferStream = new Readable();
    bufferStream.push(uploadedFile.buffer);
    bufferStream.push(null); // Signal the end of the stream

    // Upload image to Cloudinary
    const cloudinaryUpload = await cloudinary.uploader.upload_stream({
      folder: 'blog_images',
      public_id: blog._id
    }, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return next(new AppError('Error uploading image to Cloudinary', 500));
      }

      blog.image = result.secure_url;
      blog.save();
      res.status(201).json({ data: blog });
    });

    // Pipe the buffer stream to Cloudinary upload stream
    bufferStream.pipe(cloudinaryUpload);
  } catch (error) {
    console.error('Error creating product:', error);
    return next(new AppError('Internal server error', 500));
  }
});

exports.deleteFroBlog = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog=await froBlog.findById(id);
    const deletedBlog = await froBlog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return next(new AppError(`No Blog for this id ${id}`, 404));
    }

 
const public_id=`blog_images/${blog._id}`
   
      // Delete the image from Cloudinary
      try {
        const destroyResponse = await cloudinary.uploader.destroy(public_id);
        console.log('Cloudinary Delete Response:', destroyResponse);
      } catch (cloudinaryError) {
        console.error('Cloudinary Delete Error:', cloudinaryError);
        // Handle the Cloudinary error appropriately
        return next(new AppError('Error deleting image from Cloudinary', 500));
      }
    

    res.status(204).send("Deleted successfully");
  } catch (error) {
    console.error('Error deleting blog:', error);
    return next(new AppError('Internal server error', 500));
  }
});
exports.updateFroBlog = asyncHandler(async (req, res, next) => {
  const document = await froBlog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!document) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

exports.getAllFroBlog = asyncHandler(async (req, res, next) => {
  const allBlog = await froBlog.find();
  if (!allBlog) {
    return next(new AppError(`No Blog found`, 404));
  }
  res.status(201).json({ result: allBlog.length, data: allBlog });
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await froBlog.findById(id);

  if (!document) {
    return next(new AppError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});


exports.updateBlogImages = async (req, res) => {
    let newObj = {
      images: req.body.images,
    };
    try {
      let newBlog = await froBlog
        .findByIdAndUpdate(
          req.params.BlogId,
          { $set: newObj },
          { runValidators: true, new: true }
        )
        ;
  
      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        .json({ success: true, data: newBlog });
    } catch (error) {
      res
        .status(422)
        .setHeader("Content-Type", "application/json")
        .json({ success: false, message: error + " " });
    }
  };


  exports.sendmail=asyncHandler(async(req, res) => {
      const { name, email, message,phone } = req.body;
    
      // Create a nodemailer transporter with your email service provider's SMTP details
      const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port:'465',
        auth: {
          user: 'sales@frozal.com', // replace with your email
          pass: 'Sales1212@@' // replace with your email password or use an app-specific password
        }
      });
    
      // Email configuration
      const mailOptions = {
        from: 'sales@frozal.com', // replace with your email
        to: 'Info@frozal.com', // replace with the recipient's email
        subject: message,
        text: `Phone: ${phone}\nName: ${name}\n Email: ${email}\nMessage: ${message}`
      };
    
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send('Email sent successfully');
        }
      });
    }
  )

  exports.froProtect=asyncHandler(async(req,res,next)=>{
    const checkpass='Mskr1212@@';
    const user='admin';
    if(req.body.pass!==checkpass || req.body.userName !==user){
      return next(new AppError(`login failed`, 404));

    }

    res.status(200).json("sucssfully login")

  });