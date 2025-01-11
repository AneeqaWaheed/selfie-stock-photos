import React, { createContext, useContext, useState } from "react";
import * as Notifications from "expo-notifications";

const PushTokenContext = createContext();

// Custom hook to use the PushTokenContext
export const usePushTokenContext = () => useContext(PushTokenContext);

export const PushTokenProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);

  // Function to save the push token to the server
  const savePushTokenToServer = async (userId, token) => {
    try {
      const response = await fetch(
        "https://6780-103-248-222-152.ngrok-free.app/api/v1/auth/save-push-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            expoPushToken: token,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save push token");
      }

      console.log("Push token saved successfully:", data.message);
    } catch (error) {
      console.error("Error saving push token:", error.message);
    }
  };

  // Function to request permissions and get the push token
  const registerForPushNotificationsAsync = async (userId) => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.error("Failed to get push notification permissions!");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    setExpoPushToken(token);

    if (userId) {
      await savePushTokenToServer(userId, token);
    } else {
      console.warn(
        "User ID is not provided. Token will not be saved to server."
      );
    }
  };

  return (
    <PushTokenContext.Provider
      value={{ expoPushToken, registerForPushNotificationsAsync }}
    >
      {children}
    </PushTokenContext.Provider>
  );
};
