import express from "express";
import {
  registerController,
  LoginController,
  updateProfileController,
  allUsers,
  delUser,
  forgotPassword,
  resetPassword,
  verifyOTP,
} from "../controllers/authController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

import multer from "multer";
import { googleAuth } from "../controllers/GoogleSignIn.js";
import { facebookAuth } from "../controllers/facebookAuthController.js";

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
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Google Auth Routes
router.post("/google-signin", googleAuth);

router.post("/facebook", facebookAuth);

export default router;
