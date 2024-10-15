import express from "express";
import {
  deleteImageById,
  getAllImages,
  getImageById,
  getUserImages,
  updateImageMetadata,
  uploadImage,
  verifyToken,
} from "../controllers/ImageController.js";
import multer from "multer";
import path from "path";

const router = express.Router();
// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: "./uploads/userPosts",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
});

// Get all images from the database
router.get("/all-images", getAllImages);
// Route to upload an image
router.post("/upload", verifyToken, upload.single("image"), uploadImage);

// Route to get all images uploaded by the user
router.get("/user-images", verifyToken, getUserImages);

// Route to get a specific image by ID
router.get("/image/:id", verifyToken, getImageById);

// Route to update image metadata (tags or downloads)
router.put("/image/:id", verifyToken, updateImageMetadata);

// Route to delete an image by ID
router.delete("/image/:id", verifyToken, deleteImageById);
export default router;
