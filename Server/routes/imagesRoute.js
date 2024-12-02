import express from "express";
import {
  deleteImageById,
  getAllImages,
  getImageById,
  getUserImages,
  searchImages,
  updateImageMetadata,
  uploadImage,
  verifyToken,
} from "../controllers/ImageController.js";
import multer from "multer";
import path from "path";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this directory exists or create it
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames based on timestamp
  },
});

const upload = multer({ storage });

const router = express.Router();

// Get all images from the database
router.get("/all-images", getAllImages);
// Route to upload an image
router.post("/upload", verifyToken, upload.single("image"), uploadImage);

// Route to get all images uploaded by the user
router.get("/user-images", verifyToken, getUserImages);

// Route to get a specific image by ID
router.get("/image/:id", requireSignIn, getImageById);

// Route to update image metadata (tags or downloads)
router.put("/image/:id", verifyToken, updateImageMetadata);

// Route to delete an image by ID
router.delete("/image/:id", verifyToken, deleteImageById);

// search images
router.get("/search", searchImages);

export default router;
