import passport from "passport";

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
