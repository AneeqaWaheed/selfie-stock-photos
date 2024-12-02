import bucket from "../firebase.js";
import Image from "../models/imageModel.js";
import userModel from "../models/userModel.js";
import sharp from "sharp";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import JWT from "jsonwebtoken";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller function to get all images
export const getAllImages = async (req, res) => {
  try {
    console.log("Fetching all images...");
    const images = await Image.find(); // Fetch all images
    console.log("Images fetched:", images);
    res.status(200).json(images); // Return images in JSON format
  } catch (error) {
    console.error("Error fetching all images:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    console.log("mdnmsafmabfmdfas", req.header);
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Token received:", token); // Debug log

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug log

    req.userId = decoded._id;
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Route to upload an image
export const uploadImage = async (req, res) => {
  try {
    const { tags } = req.body;

    // Check if the file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    console.log("File Info:", req.file);

    const { originalname, mimetype, path, size } = req.file;

    // Validate MIME type
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(mimetype)) {
      return res
        .status(400)
        .json({ message: "Invalid file type. Please upload a valid image." });
    }

    // Read the file from disk
    const buffer = fs.readFileSync(path);

    // Analyze the image using sharp
    const metadata = await sharp(buffer).metadata();
    const { width, height } = metadata;

    // Determine orientation
    const orientation =
      width > height ? "landscape" : width < height ? "portrait" : "square";

    // Determine size category
    const sizeInKB = size / 1024;
    const sizeCategory =
      sizeInKB <= 100 ? "small" : sizeInKB <= 500 ? "medium" : "large";

    // Define the filename for Firebase
    const firebaseFileName = `${originalname}`;

    // Reference the file in Firebase Storage
    const file = bucket.file(`uploads/${firebaseFileName}`);
    const stream = file.createWriteStream({
      metadata: { contentType: mimetype },
    });

    stream.on("error", (error) => {
      console.error("Upload error:", error);
      return res.status(500).json({ message: "Image upload failed", error });
    });

    stream.on("finish", async () => {
      try {
        await file.makePublic();
        const firebaseURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        const newImage = new Image({
          filename: originalname,
          filePath: path,
          tags,
          orientation,
          size: sizeCategory,
          user: req.userId,
        });

        await newImage.save();
        await userModel.findByIdAndUpdate(req.userId, { $inc: { photos: 1 } });

        return res.status(200).json({
          message: "Image uploaded successfully",
          firebaseURL,
          orientation,
          sizeCategory,
          filePath: path,
        });
      } catch (error) {
        console.error("Error while saving to DB:", error);
        return res.status(500).json({
          message: "Failed to save image details",
          error: error.message,
        });
      }
    });

    stream.end(buffer);
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
};

// Route to get all images uploaded by the user
export const getUserImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.userId });
    res.status(200).json(images);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user images", error: error.message });
  }
};

// Route to get a specific image by ID
export const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json(image);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching image", error: error.message });
  }
};

// Route to update image metadata (tags or downloads)
export const updateImageMetadata = async (req, res) => {
  try {
    const { tags, downloads } = req.body;

    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    console.log("Image Owner ID:", image.user.toString());
    console.log("Current User ID:", req.userId);

    // Only the owner of the image can update it
    if (!image.user || image.user.toString() !== req.userId) {
      return res.status(403).json({
        message: "Unauthorized: You can only update your own images",
      });
    }

    // Update the metadata
    if (tags) image.tags = tags;
    if (downloads !== undefined) image.downloads = downloads;

    await image.save();

    res
      .status(200)
      .json({ message: "Image metadata updated successfully", image });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating image metadata", error: error.message });
  }
};

// Route to delete an image by ID
export const deleteImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    console.log("Image Owner ID:", image.user.toString());
    console.log("Current User ID:", req.userId);
    // Only the owner of the image can delete it
    if (image.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only delete your own images" });
    }

    await Image.findByIdAndDelete(req.params.id);
    await userModel.findByIdAndUpdate(req.userId, { $inc: { photos: 1 } });
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting image", error: error.message });
  }
};

// controllers/imageController.js

export const searchImages = async (req, res) => {
  const { query, orientation, size } = req.query; // Example filters

  // Construct the filter object dynamically
  let filter = {};

  // Handle search query with multiple words
  if (query) {
    const searchWords = query
      .split(" ")
      .map((word) => word.trim())
      .filter(Boolean);

    // Use $or to match any word in tags
    filter.$or = searchWords.map((word) => ({
      tags: { $regex: word, $options: "i" }, // Case-insensitive regex
    }));
  }

  // Filter by orientation if provided (e.g., 'landscape', 'portrait')
  if (orientation) {
    filter.orientation = orientation;
  }

  // Filter by predefined size categories (e.g., 'small', 'medium', 'large')
  if (size) {
    filter.size = size;
  }

  try {
    // Execute the query with all applied filters
    const images = await Image.find(filter);
    return res.status(200).json(images);
  } catch (error) {
    console.error("Error searching images:", error);
    return res.status(500).json({
      message: "Error searching images",
      error: error.message,
    });
  }
};
