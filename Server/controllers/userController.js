import UserModel from "../models/userModel.js";
import admin from "firebase-admin";
import multer from "multer";
import path from "path";
import serviceAccount from "../selfi-stock-firebase-adminsdk.json" assert { type: "json" };

// // const serviceAccount = require("../path/to/serviceAccountKey.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "your-project-id.appspot.com",
// });

// Configure Multer for handling file uploads
const storage = multer.memoryStorage(); // Use memory storage for buffer
export const upload = multer({ storage });

// Firebase Storage Bucket
const bucket = admin.storage().bucket();

// Function to upload image to Firebase Storage
export const uploadImageToFirebase = async (file) => {
  try {
    const bucket = admin.storage().bucket(); // Ensure you have the bucket initialized
    const fileName = `profileImages/${file.originalname}`; // Path where the image will be stored
    const fileRef = bucket.file(fileName);

    // Upload the image to Firebase Storage
    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false, // You can set this to true for larger files
    });

    // Get the public download URL
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2030", // Set an expiration date as needed
    });

    return url; // Return the download URL
  } catch (error) {
    console.error("Error uploading image to Firebase:", error);
    throw new Error("Failed to upload image to Firebase"); // Throw an error to handle it in the calling function
  }
};

// Fetch user profile
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await UserModel.findOne({ username }).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//update profile
export const updateUserProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const userId = req.user.userId; // Extract user ID from the token

    // Prepare the update object
    const updateData = { username, bio };

    // If an image is uploaded, save it to Firebase and get the download URL
    if (req.file) {
      const imageUrl = await uploadImageToFirebase(req.file);
      updateData.profileImage = imageUrl; // Save the download URL
    }

    // Find the user by ID and update their profile
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated user
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user data
    res.json({
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
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
