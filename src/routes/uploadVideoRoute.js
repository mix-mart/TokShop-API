const express = require("express");
const router = express.Router();
const multer = require("multer");
const videoController = require('../controllers/uploadVideos');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     if (file) {
//       cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//     } else {
//       cb(null, false);
//     }
  
//   },
// });
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["video/mp4","video/x-msvideo","video/x-matroska","video/quicktime","video/x-ms-wmv","video/x-flv","video/webm","video/3gpp","video/ogg"];
    allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  };
const upload = multer({ storage: storage,fileFilter });

// routes/videoRoute.js


// Upload a video
router.post("/upload", upload.single("video"), videoController.uploadVideo);

// Delete a video
router.delete("/delete/:blobName", videoController.deleteVideo);

module.exports = router;


