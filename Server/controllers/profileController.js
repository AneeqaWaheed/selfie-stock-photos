import Image from "../models/imageModel.js";
// Function to fetch uploader's profile by image ID
export const getUploaderProfileByImageId = async (req, res) => {
  try {
    const { imageId } = req.params;

    // Find the image by ID and populate the user field
    const image = await Image.findById(imageId).populate("user");

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Return the uploader's profile
    res.status(200).json(image.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
