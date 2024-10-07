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

export default router;
