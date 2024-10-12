const express = require('express');
const multer = require('multer');
const User = require('../Model/user'); // Ensure this path points to your User model
const jwt = require('jsonwebtoken');
const router = express.Router();
const path = require('path'); // Import path module

// Middleware to verify JWT and get user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from the header
  
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // Attach user info to the request object
    next();
  });
};

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists or create it
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames based on timestamp
  },
});

const upload = multer({ storage: storage });

// Route to fetch the user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Find user by ID stored in the token
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with user profile details (excluding password)
    res.json({
      username: user.username,        // Username
      bio: user.bio,                  // User bio
      profileImage: user.profileImage,// Profile image path or URL
      followers: user.followers,      // Followers count or details
      downloads: user.downloads,      // Downloads count or details
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update user profile (with optional image upload)
router.put('/profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    const { username, bio } = req.body;
    const userId = req.user.userId; // User ID from the token

    // Prepare the update object
    const updateData = {
      username,
      bio,
    };

    // If a new profile image is uploaded, add it to the update data
    if (req.file) {
      updateData.profileImage = req.file.path; // Save the path of the uploaded image
    }

    // Find the user by ID and update the profile fields
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }); // Return the updated user

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the updated user data
    res.json({
      username: updatedUser.username,
      bio: updatedUser.bio,
      profileImage: updatedUser.profileImage,
      followers: updatedUser.followers,
      downloads: updatedUser.downloads,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
