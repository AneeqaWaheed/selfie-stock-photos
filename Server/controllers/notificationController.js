import { NotificationModel } from "../models/notification.js";
export const saveNotification = async (userId, title, imageId) => {
  try {
    const notification = new NotificationModel({
      userId,
      title,
      body: imageId, // Reference the image using ObjectId
    });

    await notification.save();
    console.log("Notification saved successfully.");
    return notification;
  } catch (error) {
    console.error("Error saving notification:", error.message);
    throw new Error("Failed to save notification.");
  }
};

// Fetch all notifications for a user
export const getNotificationsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await NotificationModel.find({ userId })
      .populate("body") // Populate the Image details if needed
      .sort({ date: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
};
