const express = require('express');
const multer = require('multer'); // For handling image uploads
const User = require('../Model/user'); // Ensure the correct path to your User model
const authenticateToken = require('../Middleware/verifyToken'); // Middleware for token authentication
const path = require('path');

const router = express.Router();

// Configure multer for file uploads (for profile image)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save the profile images in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique filenames
  },
});

const upload = multer({ storage: storage });

// Route to update user profile (requires authentication)
router.put('/profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    const { username, bio } = req.body; // Get the fields to update from the request body
    const userId = req.user.userId; // Get the user ID from the authenticated token

    // Prepare the update data object
    const updateData = {
      username,
      bio,
    };

    // If a new profile image is uploaded, include it in the update
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`; // Store the path to the uploaded image
    }

    // Find the user by ID and update their profile
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the updated user profile
    res.json({
      message: 'Profile updated successfully',
      user: {
        username: updatedUser.username,
        bio: updatedUser.bio,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
