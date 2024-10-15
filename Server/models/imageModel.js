import mongoose from "mongoose";
const ImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true, // Full URL path of the image stored on the server
  },
  width: {
    type: Number, // Width of the image
    required: true,
  },
  height: {
    type: Number, // Height of the image
    required: true,
  },
  tags: {
    type: String, // Optional tags to categorize images
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user who uploaded the image
    required: true,
  },
  downloads: {
    type: Number,
    default: 0, // Track the number of downloads
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the timestamp when the image is uploaded
  },
});

export default mongoose.model("Image", ImageSchema);
