const express = require('express');

const {
  getAllFroBlog,
  getOne,
  deleteFroBlog,
  updateFroBlog,
  createFroBlog,
 

} = require('../controllers/froBlog');
const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });

const router = express.Router();

// router.use(authService.protect, authService.allowedTo('admin', 'manager'));

router.route('/').get(getAllFroBlog).post(upload.single('image'),createFroBlog);
router.route('/:id').get(getOne).put(updateFroBlog).delete(deleteFroBlog);


module.exports = router;