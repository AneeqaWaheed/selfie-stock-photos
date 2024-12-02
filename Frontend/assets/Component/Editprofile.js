// EditProfileScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileScreen() {
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  // Pick profile image
  const pickProfileImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setProfileImage(result.assets[0].uri); // Update selected image URI
    }
  };

  // Update profile
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
      <TextInput placeholder="Bio" value={bio} onChangeText={setBio} />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Pick Profile Image" onPress={pickProfileImage} />
      {profileImage && (
        <Image
          source={{ uri: profileImage }}
          style={{ width: 100, height: 100 }}
        />
      )}
      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
}
