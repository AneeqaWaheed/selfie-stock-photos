import jwt from "jsonwebtoken";

// Issue JWT Token
const issueToken = (user) => {
  const payload = {
    id: user.id,
    name: user.displayName,
    email: user.emails[0].value,
  };

  // Generate token with expiration
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};

// Handle Google OAuth Callback
export const googleCallback = (req, res) => {
  const token = issueToken(req.user); // Issue JWT token
  res.json({ token }); // Send token as response (or redirect with token)
};

// Logout Controller
export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

// Dashboard Route Handler
export const dashboard = (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome ${req.user.displayName}`);
  } else {
    res.redirect("/");
  }
};
