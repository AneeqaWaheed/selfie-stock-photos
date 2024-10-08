// passport-instagram.js
import passport from "passport";
import { Strategy as InstagramStrategy } from "passport-instagram";
import User from "../../models/userModel.js"; // Adjust the path as necessary

passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_APP_ID,
      clientSecret: process.env.INSTAGRAM_APP_SECRET,
      callbackURL: "http://localhost:5000/auth/instagram/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in your database
        let user = await User.findOne({ instagramId: profile.id });

        if (!user) {
          // If user doesn't exist, create a new user
          user = await new User({
            first_name: profile.displayName,
            instagramId: profile.id,
            // Store additional info if needed
          }).save();
        }
        // Call done with the user object
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
