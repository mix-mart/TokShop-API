const express = require('express');
const router = express.Router();
const multer = require('multer');
const videoController = require('../controllers/uploadVideos');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    } else {
      cb(null, false);
    }
  
  },
});
// const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.get('/list', videoController.listVideos);
router.delete('/:publicId', videoController.deleteVideo);
router.get('/:publicId', videoController.getVideo);

module.exports = router;

