import axios from "axios";
// Helper function to send notification via Firebase
const sendPushNotification = async (token, message) => {
  try {
    const response = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      {
        to: token,
        notification: {
          title: "New Purchase!",
          body: message,
          sound: "default",
        },
        priority: "high",
      },
      {
        headers: {
          Authorization: "key=YOUR_SERVER_KEY", // Replace with Firebase Server Key
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Notification sent:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
