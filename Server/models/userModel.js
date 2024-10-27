import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    profileImage: { type: String },
    username: { type: String, required: true, unique: true },
    bio: { type: String },
    oauthId: {
      type: String,
      unique: true, // Ensure this is unique
      sparse: true, // Allow null values if necessary
    },
    provider: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    followers: { type: Number, default: 0 },
    photos: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
