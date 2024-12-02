import express from "express";
import {
  registerController,
  LoginController,
  updateProfileController,
  allUsers,
  delUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import passport from "../config/passport.js";
import "../config/google/passport.js";
import "../config/facebook/passport.js"; // Import passport config
import "../config/instagram/passport.js";
import "../config/twitter/passport.js";
import { googleAuth, googleCallback } from "../controllers/googleController.js";
import {
  facebookAuth,
  facebookCallback,
} from "../controllers/facebookAuthController.js";
import {
  instagramAuth,
  instagramCallback,
} from "../controllers/instagramAuthController.js";
import {
  twitterAuth,
  twitterCallback,
} from "../controllers/twitterController.js";
import multer from "multer";
const upload = multer();

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", upload.none(), registerController);

//LOGIN || METHOD POST
router.post("/login", LoginController);

//protected  User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile

router.put("/update-profile/:id", requireSignIn, updateProfileController);
//get all users
router.get("/users", allUsers);
//delete user with id
router.delete("/delUser/:id", delUser);
//forgot password
router.post("/forgot-password", forgotPassword);
router.post("/reset/:token", resetPassword);

// Google Auth Routes
router.get("/google", googleAuth); // Initiates Google authentication
router.get("/google/callback", googleCallback); // Handles Google callback

// Facebook Auth Routes
router.get("/facebook", facebookAuth); // Initiates Facebook authentication
router.get("/facebook/callback", facebookCallback); // Handles Facebook callback

// Instagram Auth Routes
router.get("/instagram", instagramAuth); // Initiates Instagram authentication
router.get("/instagram/callback", instagramCallback); // Handles Instagram callback

// Twitter Auth Routes
router.get("/twitter", twitterAuth); // Initiates Twitter authentication
router.get("/twitter/callback", twitterCallback); // Handles Twitter callback

export default router;
