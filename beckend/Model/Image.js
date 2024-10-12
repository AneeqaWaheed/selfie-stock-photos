const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true, // Full URL path of the image stored on the server
  },
  tags: {
    type: [String], // Array of tags to categorize images
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who uploaded the image
    required: true,
  },
  downloads: {
    type: Number,
    default: 0, // Track the number of downloads
  },
  size: {
    type: Number, // File size in bytes
    required: false,
  },
  mimeType: {
    type: String, // MIME type of the file (e.g., 'image/jpeg')
    required: false,
  },
  thumbnailPath: {
    type: String, // Path to the thumbnail image
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the timestamp when the image is uploaded
  },
});

module.exports = mongoose.model('Image', ImageSchema);
