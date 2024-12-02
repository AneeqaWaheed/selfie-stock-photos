import express from "express";
import {
  followUser,
  unfollowUser,
} from "../controllers/followersControllers.js";
import { verifyToken } from "../controllers/ImageController.js";

const router = express.Router();

router.post("/follow/:id", verifyToken, followUser);

// Unfollow a user
router.post("/unfollow/:id", verifyToken, unfollowUser);

export default router;
