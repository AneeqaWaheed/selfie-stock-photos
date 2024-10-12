const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true }, // Added username
  bio: { type: String }, // Added bio
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String }, // Store the file path or base64 string here
});

const User = mongoose.model('User', userSchema);

module.exports = User;
