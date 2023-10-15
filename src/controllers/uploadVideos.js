const cloudinary = require('cloudinary').v2;
const Video = require('../models/uplodedVideoSchema');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

// Upload a video to Cloudinary
exports.uploadVideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File upload failed' });
  }

  try {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{
        resource_type: 'video', // Specify the resource type as 'video'
      });

    // Save video details to your database
    const video = new Video({
      title: req.file.originalname,
      publicId: public_id,
      secureUrl: secure_url,
    });
    await video.save();

    res.status(200).json({
      message: 'File uploaded successfully',
      video: video,
    });
  } catch (error) {
    console.error('Error while uploading video:', error);
    res.status(500).json({ message: 'Error while uploading video' });
  }
};

// List all uploaded videos
exports.listVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json({ videos });
  } catch (error) {
    console.error('Error while listing videos:', error);
    res.status(500).json({ message: 'Error while listing videos' });
  }
};

// Delete a video by its public ID
exports.deleteVideo = async (req, res) => {
  const publicId = req.params.publicId;

  try {
    const video = await Video.findOne({ publicId });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete the video from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete the video record from your database
    await video.remove();

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error while deleting video:', error);
    res.status(500).json({ message: 'Error while deleting video' });
  }
};

// Get a specific video by public ID
exports.getVideo = async (req, res) => {
    const publicId = req.params.publicId;
  
    try {
      const video = await Video.findOne({ publicId });
  
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
  
      // Respond with the video object or desired information
      res.status(200).json(video);
    } catch (error) {
      console.error('Error while fetching video:', error);
      res.status(500).json({ message: 'Error while fetching video' });
    }
  };