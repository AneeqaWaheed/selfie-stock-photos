import Image from "../models/imageModel.js";

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
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Route to upload an image
export const uploadImage = async (req, res) => {
  try {
    const { tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const filePath = `http://your-server-url/uploads/userPosts/${req.file.filename}`;

    const newImage = new Image({
      filename: req.file.filename,
      filePath,
      tags,
      user: req.userId, // Associate the image with the logged-in user
    });

    await newImage.save();

    res.status(200).json({ message: "Image uploaded successfully", filePath });
  } catch (error) {
    res
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

    // Only the owner of the image can update it
    if (image.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only update your own images" });
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

    // Only the owner of the image can delete it
    if (image.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only delete your own images" });
    }

    await Image.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting image", error: error.message });
  }
};
