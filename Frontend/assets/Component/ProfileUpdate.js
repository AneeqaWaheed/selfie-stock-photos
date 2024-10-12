// ProfileUpdate.js (could be part of EditProfileScreen.js or its own component)
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProfileUpdate() {
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  const updateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        'http://192.168.100.186:5000/api/profile/update',
        { bio, location },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Failed to update profile');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter bio"
        value={bio}
        onChangeText={setBio}
      />
      <TextInput
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
}
