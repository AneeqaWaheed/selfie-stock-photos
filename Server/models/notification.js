import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  body: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: true,
  },
  date: { type: Date, default: Date.now },
});

export const NotificationModel = mongoose.model(
  "Notification",
  NotificationSchema
);
