const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const Image = require('../Model/Image'); // Ensure your Image model is correctly imported

const router = express.Router();

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/';
    cb(null, uploadPath); // Set destination folder for image uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename file to timestamp-originalname
  },
});

// Configure multer for file uploads
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/; // Only allow JPEG, JPG, PNG formats
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true); // Accept file
    } else {
      cb(new Error('Only JPEG, JPG, and PNG images are allowed!')); // Reject file if not an image
    }
  },
});

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from header
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
    req.userId = decoded.userId; // Extract userId from the token
    next();
  } catch (error) {
    console.error('JWT Verification Failed:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Route to handle image uploads from gallery or camera with tags metadata
router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { tags } = req.body;

    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const file = req.file;
    const filePath = `http://192.168.100.186:5000/uploads/${file.filename}`; // Set full URL for the image

    console.log('File uploaded successfully:', file.filename);

    // Create and save the new image with the tags and userId
    const newImage = new Image({
      filename: file.filename,
      filePath: filePath,
      tags,
      user: req.userId,  // Associate the image with the logged-in user
    });

    await newImage.save(); // Save the image to the database
    console.log('Image saved to database');

    res.status(200).json({ message: 'Image uploaded successfully', filePath });
  } catch (error) {
    console.error('Error during upload:', error.message);
    res.status(500).json({ message: 'Error uploading the image', error: error.message });
  }
});

module.exports = router;
