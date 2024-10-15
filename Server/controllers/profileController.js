import Image from "../models/imageModel.js";
// Function to fetch uploader's profile by image ID
export const getUploaderProfileByImageId = async (req, res) => {
  const { imageId } = req.params;

  try {
    // Find the image by its _id and populate the uploader's profile (User)
    const image = await Image.findById(imageId).populate(
      "user",
      "username bio profileImage followers"
    );

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Ensure the profileImage is a complete URL
    const profileImageURL = `${req.protocol}://${req.get(
      "host"
    )}/${image.user.profileImage.replace(/\\/g, "/")}`; // Replace backslashes for compatibility

    const uploaderProfile = {
      username: image.user.username,
      bio: image.user.bio,
      profileImage: profileImageURL, // Use the complete URL
      followers: image.user.followers, // Send the followers count if it's part of the User model
    };

    res.json({
      message: "User profile fetched successfully",
      profile: uploaderProfile,
    });
  } catch (error) {
    console.error("Error fetching image profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
