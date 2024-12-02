import express from "express";
import { getUploaderProfileByImageId } from "../controllers/profileController.js";
import multer from "multer";
import path from "path"; // Import path module
import {
  getUserProfile,
  updateProfile,
  updateUserProfile,
  uploadMiddleware,
} from "../controllers/userController.js";
import { verifyToken } from "../controllers/ImageController.js";
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this directory exists or create it
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames based on timestamp
  },
});
const upload = multer({ storage: storage });

// Route to fetch the user profile
router.get("/profile/:username", verifyToken, getUserProfile); // Use the controller function

// Route to update user profile (with optional image upload)
router.put(
  "/profile",
  verifyToken,
  upload.single("profileImage"),
  updateUserProfile
); // Use the controller function

router.get("/image-profile/:imageId/uploader", getUploaderProfileByImageId); // Use the controller function

router.put("/profile", verifyToken, uploadMiddleware, updateProfile);
export default router;
