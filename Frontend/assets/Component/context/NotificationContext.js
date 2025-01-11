import React, { createContext, useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      if (status !== "granted") {
        await Permissions.askAsync(Permissions.NOTIFICATIONS);
      }
    };

    const getPushToken = async () => {
      const token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token.data);
    };

    requestPermission();
    getPushToken();

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          notification,
        ]);
      });

    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, []);

  const sendTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "This is a test notification",
      },
      trigger: null,
    });
  };

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notifications, sendTestNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
