const mongoose = require("mongoose");

// Define the Profile schema (for additional user info)
const profileSchema = new mongoose.Schema({
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  profileImage: { type: String, default: "" }, // URL of the profile image
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], // List of image references (posts)
  downloads: { type: Number, default: 0 }, // Number of downloads of user's images
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference back to the User
});

module.exports = mongoose.model("Profile", profileSchema);
