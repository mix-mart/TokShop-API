// Define a Video model schema (using Mongoose, if desired)
const mongoose = require('mongoose');
const { Schema } = mongoose;

const videoSchema = new Schema({
  title: String,
  publicId: String, // The Cloudinary public ID of the video
  secureUrl: String, // The URL to play the video
  productId:String
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
