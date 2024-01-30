const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const path = require('path');
const froBlog = require("../models/froblogModel");
const nodemailer = require('nodemailer');

exports.createFroBlog = asyncHandler(async (req, res, next) => {
    try {
      const blog = await froBlog.create(req.body);
      if (!blog) {
        return next(new AppError(`Error while creating blog`, 404));
      }
  
      const uploadedFiles = req.files;
      if (!uploadedFiles) {
        return next(new AppError(`blog images required`, 404));
      }
  
      const savedImages = await Promise.all(
        uploadedFiles.map(async (file) => {
          if (!file.originalname || !file.buffer || !file.mimetype) {
            console.error('Invalid file object:', file);
            return null;
          }
  
          // Save image to the 'images' folder
          const imagePath = path.join(__dirname, '../../uploads/images', file.originalname);
          file.buffer = Buffer.from(file.buffer);
          require('fs').writeFileSync(imagePath, file.buffer);
  
          // Log the image information
          console.log('Image Saved:', {
            filename: file.originalname,
            path: imagePath,
           
          });
  
          return {
            filename: file.originalname,
            path: imagePath,
          
          };
        })
      );
  
      // Log the saved images
      console.log('Saved Images:', savedImages);
  
      // Filter out null values (invalid files)
      const validImages = savedImages.filter((image) => image !== null);
  
      blog.images = validImages;
      await blog.save();
  
      res.status(201).json({ data: blog });
    } catch (error) {
      console.error('Error creating product:', error);
      return next(new AppError('Internal server error', 500));
    }
  });

exports.deleteFroBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedBlog = await froBlog.findByIdAndDelete(id);

  if (!deletedBlog) {
    return next(new AppError(`No Blog for this id ${id}`, 404));
  }
  res.status(204).send("deleted sucssfully");
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