import jwt from "jsonwebtoken";

// Facebook authentication callback controller
export const facebookAuthCallback = (req, res) => {
  const user = req.user; // Passport attaches the authenticated user to req.user

  // Check if user exists
  if (!user) {
    return res.status(400).json({ message: "Authentication failed" });
  }

  // Generate a JWT
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET, // Ensure JWT_SECRET is set in your .env file
    { expiresIn: "1h" } // Token expiry time
  );

  // Send back the token and user details to frontend
  return res.json({ token, user });
};
