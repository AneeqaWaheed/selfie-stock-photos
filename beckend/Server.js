const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

// Initialize express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// MongoDB connection using the environment variable from .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Serve uploaded images statically from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require('./Routes/User');
const imageUploadRoutes = require('./Routes/Camera');
const userImagesRoutes = require('./Routes/Image');
const profileDataRoutes = require('./Routes/profile');
const allImagesRoutes = require('./Routes/AllImages');
const UpdateProfileRoutes = require('./Routes/UpdateProfile');
const imageProfileRoutes = require('./Routes/imageprofile');  // Ensure this is correct
const followerRoutes=require('./Routes/Follower')

// Register the routes
app.use('/api', userRoutes); // Routes for user authentication (login, register, etc.)
app.use('/api', imageUploadRoutes); // Routes for handling image uploads
app.use('/api', userImagesRoutes); // Routes for user images
app.use('/api', profileDataRoutes); // Routes for profile data
app.use('/api', allImagesRoutes); // Routes for all images
app.use('/api', imageProfileRoutes); // Routes for image profile
app.use('/api', UpdateProfileRoutes)
app.use('/api' , followerRoutes)
// Start the server using the PORT from the environment variables, defaulting to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://192.168.100.186:${PORT}`);
});
