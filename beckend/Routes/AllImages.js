// Routes/AllImages.js

const express = require('express');
const router = express.Router();
const Image = require('../Model/Image'); // Adjust the path as necessary

// Get all images from the database
router.get('/all-images', async (req, res) => {
    try {
      console.log('Fetching all images...');
      const images = await Image.find(); // Fetch all images
      console.log('Images fetched:', images);
      res.status(200).json(images); // Return images in JSON format
    } catch (error) {
      console.error('Error fetching all images:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  

module.exports = router;
