import React, { useEffect, useState } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import BottomNavigation from "../Component/BottomNavigation"; // Import BottomNavigation

const MyWorksScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [userImages, setUserImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true); // Loading state for images
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Retrieve the username from AsyncStorage
        const username = await AsyncStorage.getItem("username");
        console.log("sdffmanfs", username);
        const token = await AsyncStorage.getItem("token");
        if (username) {
          // Make API call to get the user profile
          const response = await axios.get(
            `https://8505-103-248-222-152.ngrok-free.app/api/profile/profile/${username}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setUser(response.data);
          setProfileImage(response?.data?.profileImage);
        } else {
          setError("No username found in storage");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Could not fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Function to fetch user-uploaded images
  const fetchUserImages = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://8505-103-248-222-152.ngrok-free.app/api/images/user-images`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // if using JWT for authentication
          },
        }
      );
      const images = response.data.map((item) => ({
        ...item,
        imageUrl: `https://8505-103-248-222-152.ngrok-free.app/${item.filePath.replace(
          "\\",
          "/"
        )}`, // Replace `\` with `/` for valid URLs
      }));
      // Axios automatically throws an error for non-2xx status codes
      setUserImages(images); // Use response.data to access the data
      console.log(response);
    } catch (err) {
      console.log("bcvcbcbc", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchUserImages(); // Fetch images when the component mounts
  }, []);

  // Function to handle profile image update
  const pickProfileImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Function to save profile changes
  const saveProfileChanges = async () => {
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

  // Render user-uploaded images in a grid format
  const renderImageItem = ({ item }) => (
    // <TouchableOpacity
    //   onPress={() => navigation.navigate("ImageDetail", { image: item })}
    // >
    <Image
      style={styles.imageItem}
      source={{ uri: item.imageUrl }}
      resizeMode="cover" // Use "cover" for resizing images
    />
    // </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickProfileImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image
              source={require("../../assets/Images/images.jpeg")}
              style={styles.profileImage}
            />
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
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveProfileChanges}
            >
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.userName}>{user?.username}</Text>
            <Text style={styles.userBio}>{user?.bio}</Text>
            <TouchableOpacity
              onPress={() => setEditingProfile(true)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}

        {/* User Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {user?.followers?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.photos || 0}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.downloads || 0}</Text>
            <Text style={styles.statLabel}>Downloads</Text>
          </View>
        </View>
      </View>

      {/* User Uploaded Images */}
      <FlatList
        data={userImages}
        renderItem={renderImageItem}
        keyExtractor={(item) => item._id}
        numColumns={3} // Grid layout with 3 columns
        contentContainerStyle={styles.imagesGrid}
        ListEmptyComponent={<Text>No images available.</Text>}
      />

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#617FE5",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  userBio: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  editButton: {
    marginTop: 10,
    backgroundColor: "#FFC107",
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "80%",
  },
  saveButton: {
    backgroundColor: "#34C759",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "#fff",
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
  imagesGrid: {
    padding: 10,
    justifyContent: "center",
  },
  image: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    margin: 5,
    borderRadius: 10, // Optional: For rounded corners
  },
});

export default MyWorksScreen;
