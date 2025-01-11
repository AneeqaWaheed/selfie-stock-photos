import express from "express";
import {
  followUser,
  getFollowingStatus,
  unfollowUser,
} from "../controllers/followersControllers.js";
import { verifyToken } from "../controllers/ImageController.js";

const router = express.Router();

router.post("/follow/:id", verifyToken, followUser);

router.get("/followers/status/:targetUserId", getFollowingStatus);

// Unfollow a user
router.post("/unfollow/:id", verifyToken, unfollowUser);

export default router;
