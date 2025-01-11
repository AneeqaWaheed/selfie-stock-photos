import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import jwtDecode from "jwt-decode";
export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  // Function to fetch notifications for the user
  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken._id;

      const response = await fetch(
        `https://6780-103-248-222-152.ngrok-free.app/api/notification/get-notifications/${userId}`
      );

      const responseData = await response.json(); // Get the response as JSON

      if (response.ok) {
        setNotifications(responseData); // Use the data if the response is OK
      } else {
        console.log("API response error: ", responseData); // Log the response body for debugging
        throw new Error(`Failed to fetch notifications: ${responseData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", `Failed to fetch notifications: ${error.message}`);
    }
  };
  console.log(notifications);

  // Fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        {/* Display the image on the left side */}
        <Image
          source={{
            uri: `https://6780-103-248-222-152.ngrok-free.app/${item.body.filePath}`,
          }} // Update this path as per your backend
          style={styles.notificationImage}
        />
        <View style={styles.notificationText}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {/* If body is an object, extract necessary fields */}
          <Text>{new Date(item.date).toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      {notifications?.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text>No notifications yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  notificationItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  notificationContent: {
    flexDirection: "row", // Place image on the left and text on the right
    alignItems: "center", // Align items vertically in the center
  },
  notificationImage: {
    width: 50, // Set a fixed width for the image
    height: 50, // Set a fixed height for the image
    borderRadius: 5, // Optional: add rounded corners
    marginRight: 10, // Space between the image and the text
  },
  notificationText: {
    flex: 1, // Take the remaining space for the text
  },
  notificationTitle: {
    fontWeight: "bold",
  },
});
