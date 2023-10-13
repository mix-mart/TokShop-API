// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg'); 
const fs = require('fs');
const path = require('path');
const videoMetadataThumbnails = require('video-metadata-thumbnails');
const videoDuration = require('video-duration');

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploads in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const originalname = file.originalname;
    const sanitizedFilename = originalname.replace(/ /g, '-');
    cb(null, Date.now() + '-' + sanitizedFilename); // Create a unique file
  },
});

const upload = multer({ storage: storage });

// Handle file uploads
router.post('/upload', upload.single('video'), async (req, res) => {
  if (req.file) {
    console.log(req.file)
    console.log('File uploaded:', req.file.originalname);
    // const sanitizedFileName = req.file.originalname.replace(/ /g, '.');
    const filePath = path.join(__dirname,'../../uploads', req.file.filename);
    console.log(filePath)

    try {
      const duration = await videoDuration(filePath);
      console.log('Video duration:', duration, 'seconds');
      res.json({ message: 'File uploaded successfully', duration });
    } catch (err) {
      console.error('Error while extracting video duration:', err);
      res.status(500).json({ message: 'Error while extracting video duration' });
    }
  } else {
    // Handle if the file upload fails
    res.status(400).json({ message: 'File upload failed' });
  }
});
// List uploaded videos
router.get('/all', (req, res) => {
  const videoDirectory = path.join(__dirname, '../../uploads');
  fs.readdir(videoDirectory, (err, files) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(files);
  });
});

// Delete a video
router.delete('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads', filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: 'Video deleted successfully' });
  });
});

// Create a route to serve videos
router.get('/:filename', (req, res) => {
    const videoDirectory = path.join(__dirname, '../../uploads');
    const filename = req.params.filename;
    const filePath = path.join(videoDirectory, filename);
  
    // Check if the video file exists
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const range = req.headers.range;
     
  
      if (range) {
        // Handle partial video requests (streaming)
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const headers = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        };
        console.log(req.header)
  
        res.writeHead(206, headers);
        file.pipe(res);
      } else {
        // Stream the entire video
        const file = fs.createReadStream(filePath);
        const headers = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };
  console.log(req.header)
        res.writeHead(200, headers);
        file.pipe(res);
      }
    } else {
      res.status(404).send('Video not found');
    }
  });

module.exports = router;
