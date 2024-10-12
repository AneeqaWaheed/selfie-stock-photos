import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator, // Import ActivityIndicator for loading state
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import BottomNavigation from '../Component/BottomNavigation'; // Import BottomNavigation

const MyWorksScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [userImages, setUserImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true); // Loading state for images

  // Fetch profile and images on component load
  useEffect(() => {
    const loadData = async () => {
      await fetchUserProfile();
      await fetchUserImages();
    };
    loadData();
  }, []);

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found, please login.');
        return;
      }

      const response = await axios.get('http://192.168.100.186:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Profile Response:', response.data);

      const profileData = response.data;
      setUser(profileData);
      setUsername(profileData.username || '');
      setBio(profileData.bio || '');

      const imageUrl = profileData.profileImage ? 
        `http://192.168.100.186:5000/${profileData.profileImage.replace(/\\/g, '/')}` : null;
      console.log('Constructed Profile Image URL:', imageUrl);
      setProfileImage(imageUrl);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error fetching user data');
    }
  };

  // Function to fetch user-uploaded images
  const fetchUserImages = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found, please login.');
        return;
      }

      const response = await axios.get('http://192.168.100.186:5000/api/user-images', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('User Images Response:', response.data); // Log the response

      if (Array.isArray(response.data) && response.data.length > 0) {
        const imagesWithFullUrl = response.data.map(image => {
          console.log('Original Image Object:', image); // Log each image object
          const isAbsoluteUrl = image.filePath.startsWith('http://') || image.filePath.startsWith('https://');
          return {
            ...image,
            filePath: isAbsoluteUrl 
              ? image.filePath // Keep it as is if it’s already a full URL
              : `http://192.168.100.186:5000/${image.filePath.replace(/\\/g, '/')}`, // Construct the URL if not
          };
        });

        console.log('Constructed Image URLs:', imagesWithFullUrl); // Log constructed URLs
        setUserImages(imagesWithFullUrl);
      } else {
        console.log('No images found in the response.');
        setUserImages([]); // Clear images if none found
      }
    } catch (error) {
      console.error('Error fetching user images:', error);
      Alert.alert('Error fetching user images');
    } finally {
      setLoadingImages(false); // Set loading to false after fetch
    }
  };

  // Function to handle profile image update
  const pickProfileImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission to access gallery is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Function to save profile changes
  const saveProfileChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found, please login.');
        return;
      }

      const formData = new FormData();
      formData.append('username', username);
      formData.append('bio', bio);

      if (profileImage) {
        const filename = profileImage.split('/').pop();
        const type = `image/${filename.split('.').pop()}`;
        formData.append('profileImage', { uri: profileImage, name: filename, type });
      }

      const response = await axios.put('http://192.168.100.186:5000/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedProfile = response.data;
      setUser(updatedProfile);
      setUsername(updatedProfile.username);
      setBio(updatedProfile.bio);
      setProfileImage(updatedProfile.profileImage);

      Alert.alert('Profile updated successfully!');
      setEditingProfile(false);
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error updating profile');
    }
  };

  // Render user-uploaded images in a grid format
  const renderImageItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ImageDetail', { image: item })}>
      <Image
        style={styles.imageItem}
        source={{ uri: item.filePath }}
        resizeMode="cover" // Use "cover" for resizing images
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickProfileImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image source={require('../../assets/Images/images.jpeg')} style={styles.profileImage} />
          )}
        </TouchableOpacity>

        {/* Editable Profile Fields */}
        {editingProfile ? (
          <>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
            />
            <TextInput
              style={styles.input}
              value={bio}
              onChangeText={setBio}
              placeholder="Enter your bio"
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveProfileChanges}>
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.userName}>{username || user.username}</Text>
            <Text style={styles.userBio}>{bio || user.bio}</Text>
            <TouchableOpacity onPress={() => setEditingProfile(true)} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}

        {/* User Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followers || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userImages.length || 0}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.downloads || 0}</Text>
            <Text style={styles.statLabel}>Downloads</Text>
          </View>
        </View>
      </View>

      {/* User Uploaded Images */}
      <FlatList
        data={userImages}
        renderItem={renderImageItem}
        keyExtractor={(item) => item._id}
        numColumns={3} // Display images in 3 columns for grid layout
        contentContainerStyle={styles.imagesGrid}
        ListEmptyComponent={<Text>No images available.</Text>} // Fallback UI
      />

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#617FE5',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  userBio: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '80%',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
  },
  imagesGrid: {
    padding: 10,
  },
  imageItem: {
    width: 120, // Adjust width to ensure 3 columns fit within the screen
    height: 120,
    margin: 5,
    borderRadius: 10,
  },
});

export default MyWorksScreen;
