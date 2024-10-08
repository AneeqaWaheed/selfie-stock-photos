// controllers/instagramController.js
import jwt from "jsonwebtoken";
import passport from "passport";

export const instagramCallback = (req, res) => {
  // After successful authentication, you can access the user object
  const user = req.user; // This contains the user information

  // Create a JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email }, // Payload: you can include more user info here
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token expiration time
  );

  // Send the token to the frontend
  res.json({
    message: "Authentication successful",
    token: token, // Send the token to the frontend
    user: user, // Send user info to the frontend if needed
  });
};
