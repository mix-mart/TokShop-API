const express = require('express');

const {
  getAllFroBlog,
  getOne,
  deleteFroBlog,
  updateFroBlog,
  createFroBlog,
  froProtect,

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

router.route('/').get(getAllFroBlog).post(upload.array('images', 5),createFroBlog);
router.route('/:id').get(getOne).put(updateFroBlog).delete(deleteFroBlog);
router.get('/check',froProtect)

module.exports = router;