import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import multer from "multer"; // For handling image uploads
import path from "path";

// Middleware to verify JWT and get user
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save the profile images in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique filenames
  },
});

const upload = multer({ storage: storage });
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from the header

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user; // Attach user info to the request object
    next();
  });
};

// Fetch user profile
export const getUserProfile = async (req, res) => {
  try {
    // Find user by ID stored in the token
    const user = await UserModel.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user profile details (excluding password)
    res.json({
      username: user.username, // Username
      bio: user.bio, // User bio
      profileImage: user.profileImage, // Profile image path or URL
      followers: user.followers, // Followers count or details
      downloads: user.downloads, // Downloads count or details
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile (with optional image upload)
export const updateUserProfile = async (req, res) => {
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
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }); // Return the updated user

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
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
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//update profile

export const updateProfile = async (req, res) => {
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
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user profile
    res.json({
      message: "Profile updated successfully",
      user: {
        username: updatedUser.username,
        bio: updatedUser.bio,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Export multer middleware for use in routes
export const uploadMiddleware = upload.single("profileImage");
