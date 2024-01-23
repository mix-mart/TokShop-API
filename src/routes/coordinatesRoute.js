const express = require("express");
const coordinatesController = require('../controllers/coordinates');
const passport = require("passport");
const authController = require('../controllers/auth');

const coordinatesRouter = express.Router();

coordinatesRouter.use(authController.protect)
coordinatesRouter.route('/').patch(coordinatesController.updateProductCoordinates).get(coordinatesController.getProductCoordinates)



module.exports = coordinatesRouter;
