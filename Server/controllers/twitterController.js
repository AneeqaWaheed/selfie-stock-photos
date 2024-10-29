import passport from "passport";
import User from "../models/userModel.js"; // Adjust path as necessary
import JWT from "jsonwebtoken"; // Import JWT for token generation

// export const twitterAuth = (req, res, next) => {
//   passport.authenticate("twitter")(req, res, next);
// };

export const twitterAuth = (req, res, next) => {
  passport.authenticate(
    "twitter",
    { scope: ["profile", "email"] },
    async (err, profile) => {
      if (err) return next(err);

      if (!profile || !profile.emails || !profile.emails[0]) {
        return res
          .status(400)
          .json({ error: "Invalid profile data from Google." });
      }

      try {
        const oauthId = profile.id;
        // Proceed with finding or creating the user
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new User({
            oauthId: oauthId,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            email: profile.emails[0].value,
            profileImage: profile.photos[0].value,
            username: profile.emails[0].value.split("@")[0],
            bio: "This user signed up using Google",
          });
          await user.save();
        }

        const token = await JWT.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

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

        console.log("Google Profile:", profile);
        console.log("User found in DB:", user);
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};

export const twitterCallback = async (req, res, next) => {
  passport.authenticate("twitter", async (err, profile) => {
    if (err) return next(err);

    try {
      const oauthId = profile.id;
      // Check if user already exists
      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
        // Create a new user if they don't exist
        user = new User({
          oauthId: oauthId,
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          email: profile.emails[0].value,
          profileImage: profile.photos[0].value,
          username: profile.emails[0].value.split("@")[0],
          bio: "This user signed up using Google",
        });
        await user.save();
      }

      // Generate a JWT token
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send response
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
