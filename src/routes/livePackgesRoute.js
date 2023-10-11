const express = require('express');
const router = express.Router();
const livePackageController = require('../controllers/livePackges');

// Create a new package
router.post('/', livePackageController.createLivePackage);

// Get all packages
router.get('/', livePackageController.getAllLivePackages);

// Get a single package by ID
router.get('/:id', livePackageController.getSpcificLivePackge);

// Update an existing package
router.put('/:id', livePackageController.updateLivepackage);

// Delete a package by ID
router.delete('/:id', livePackageController.deleteLivePackages);

module.exports = router;
