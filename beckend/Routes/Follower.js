const express = require('express');
const Profile = require('../Model/Profile'); // Path to Profile model
const jwt = require('jsonwebtoken'); // Ensure you have jwt installed
const mongoose = require('mongoose');
const router = express.Router();

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.userId = user.userId; // Attach user ID to the request object
    next();
  });
};

// Route to follow or unfollow a user
router.post('/follow/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params; // Get the userId from the URL params
    const currentUserId = req.userId; // Get the current logged-in user's ID from the JWT token
  
    try {
      // Convert userId to MongoDB ObjectId if necessary
      const userToFollowId = mongoose.Types.ObjectId(userId);
      const currentUserProfile = await Profile.findOne({ user: currentUserId });
      const userToFollow = await Profile.findOne({ user: userToFollowId });
  
      if (!userToFollow || !currentUserProfile) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the user is already following
      const alreadyFollowing = currentUserProfile.following.includes(userToFollowId);
      
      if (alreadyFollowing) {
        // Unfollow the user
        currentUserProfile.following = currentUserProfile.following.filter(id => id.toString() !== userToFollowId.toString());
        userToFollow.followers--; // Decrease follower count
      } else {
        // Follow the user
        currentUserProfile.following.push(userToFollowId);
        userToFollow.followers++; // Increase follower count
      }
  
      await currentUserProfile.save();
      await userToFollow.save();
  
      res.json({
        message: alreadyFollowing ? 'Unfollowed successfully' : 'Followed successfully',
        following: !alreadyFollowing // Return the new following status
      });
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
