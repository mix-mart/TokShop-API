const express = require('express');
const livePackges=require("../models/livePackageSchema");


exports.createLivePackage=async (req, res) => {
    try {
      const package = new livePackges(req.body);
      await package.save();
      res.status(201).json(package);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.getAllLivePackages=async (req, res) => {
    try {
      const packages = await livePackges.find();
      res.status(200).json({result:packages.length,Data:packages});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.getSpcificLivePackge=async (req, res) => {
    try {
      const package = await livePackges.findById(req.params.id);
      if (!package) {
        return res.status(404).json({ error: 'Package not found' });
      }
      res.status(200).json(package);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.updateLivepackage=async (req, res) => {
    try {
      const package = await livePackges.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Return the updated package
      });
      if (!package) {
        return res.status(404).json({ error: 'Package not found' });
      }
      res.status(200).json(package);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.deleteLivePackages=async (req, res) => {
    try {
      const package = await livePackges.findByIdAndRemove(req.params.id);
      if (!package) {
        return res.status(404).json({ error: 'Package not found' });
      }
      res.status(204).send(); // No content, successful deletion
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };