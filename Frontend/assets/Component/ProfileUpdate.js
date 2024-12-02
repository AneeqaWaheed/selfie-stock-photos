// ProfileUpdate.js (could be part of EditProfileScreen.js or its own component)
import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function ProfileUpdate() {
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [username, setUsername] = useState("");

  const updateProfile = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);

    if (profileImage) {
      formData.append("profileImage", {
        uri: profileImage.uri,
        type: profileImage.type,
        name: profileImage.uri.split("/").pop(),
      });
    }

    try {
      const token = await AsyncStorage.getItem("token"); // Get auth token
      const response = await axios.put(
        `https://8505-103-248-222-152.ngrok-free.app/api/profile/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <View>
      <TextInput placeholder="Enter bio" value={bio} onChangeText={setBio} />
      <TextInput
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
}
