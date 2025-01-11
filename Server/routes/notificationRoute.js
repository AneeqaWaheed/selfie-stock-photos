import express from "express";
import {
  getNotificationsByUser,
  saveNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// Route to save a notification
router.post("/send-notifications", async (req, res) => {
  const { userId, title, imageId } = req.body;

  if (!userId || !title || !imageId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const notification = await saveNotification(userId, title, imageId);
    res
      .status(201)
      .json({ message: "Notification saved successfully", notification });
  } catch (error) {
    console.error("Error in saving notification:", error.message);
    res.status(500).json({ error: "Failed to save notification." });
  }
});

// Route to fetch notifications for a user
router.get("/get-notifications/:userId", getNotificationsByUser);

export default router;
