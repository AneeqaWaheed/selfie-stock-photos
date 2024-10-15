import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Initialize Passport with Google OAuth Strategy
export function initializePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("Google profile:", profile);
        // Handle user profile here (store in DB or session)
        return done(null, profile);
      }
    )
  );

  // Serialize user into the session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user from the session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}
