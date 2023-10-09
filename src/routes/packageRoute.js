const express = require("express");
const packages=require('../controllers/packages')
const Router = express.Router();

Router.route("/")
.post(packages.createPackage)
.get(packages.getAllPackage)
Router.route("/:id")
.get(packages.getPackage)
.delete(packages.deletePackage)
.put(packages.updatePackage)





module.exports=Router