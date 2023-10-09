const express = require('express');

const {
  getcoupon,
  getAllcoupon,
  deleteCoupon,
  updatecoupon,
  createcoupon,
  applyCoupon,
} = require('../controllers/coupon');


const router = express.Router();

// router.use(authService.protect, authService.allowedTo('admin', 'manager'));
router.put('/applyCoupon', applyCoupon);
router.route('/').get(getAllcoupon).post(createcoupon);
router.route('/:id').get(getcoupon).put(updatecoupon).delete(deleteCoupon);

module.exports = router;