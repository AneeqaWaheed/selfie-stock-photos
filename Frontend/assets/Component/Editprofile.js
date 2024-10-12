// EditProfileScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // Pick profile image
  const pickProfileImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
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
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('bio', bio);
      formData.append('location', location);

      if (profileImage) {
        const filename = profileImage.split('/').pop();
        const type = `image/${filename.split('.').pop()}`;
        formData.append('profileImage', { uri: profileImage, name: filename, type });
      }

      await axios.put('http://192.168.100.186:5000/api/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error updating profile');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Pick Profile Image" onPress={pickProfileImage} />
      {profileImage && <Image source={{ uri: profileImage }} style={{ width: 100, height: 100 }} />}
      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
}
