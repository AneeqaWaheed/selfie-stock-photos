import passport from "passport";
import User from "../models/userModel.js"; // Adjust path as necessary
import JWT from "jsonwebtoken"; // Import JWT for token generation

export const instagramAuth = (req, res, next) => {
  passport.authenticate("instagram")(req, res, next);
};

export const instagramCallback = async (req, res, next) => {
  passport.authenticate("instagram", async (err, profile) => {
    if (err) return next(err);

    try {
      // Check if user already exists
      let user = await User.findOne({ email: profile._json.data.email }); // Instagram may not provide email

      if (!user) {
        // Create a new user if they don't exist
        user = new User({
          first_name: profile.displayName.split(" ")[0],
          last_name: profile.displayName.split(" ")[1] || "",
          email: profile._json.data.email || `${profile.id}@instagram.com`, // Fallback email
          profileImage: profile._json.data.profile_picture,
          username: profile.username,
          bio: "This user signed up using Instagram", // Default bio
        });
        await user.save();
      }

      // Generate a JWT token
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      // Send the token back in the response (adjust as necessary)
      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          profileImage: user.profileImage,
        },
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};
