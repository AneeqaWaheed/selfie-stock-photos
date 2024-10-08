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
import passport from "passport";
import { facebookAuthCallback } from "../controllers/facebookAuthController.js";
import { instagramCallback } from "../controllers/instagramAuthController.js";
//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

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

{
  /* FACEBOOK*/
}

// Route to start Facebook login process
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// Facebook callback route
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  facebookAuthCallback // Call the controller function here
);

// Log out route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

{
  /* INSTAGRAM*/
}

router.get("/instagram", passport.authenticate("instagram"));

// Instagram Callback Route
router.get(
  "/instagram/callback",
  passport.authenticate("instagram", { failureRedirect: "/login" }),
  instagramCallback // Call the controller for handling the response
);

export default router;
