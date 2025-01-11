import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const AllImagesScreen = () => {
  const navigation = useNavigation(); // Initialize navigation hook
  const [allImages, setAllImages] = useState([]); // State to hold all images
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all images from the API
  const fetchAllImages = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Get auth token
      const response = await axios.get(
        `https://6780-103-248-222-152.ngrok-free.app/api/images/all-images`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllImages(response.data); // Set fetched images to state
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Failed to fetch images");
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  useEffect(() => {
    fetchAllImages(); // Fetch images when component mounts
  }, []);
  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={allImages}
        renderItem={({ item }) => (
          <View style={styles.imageItem}>
            <Image
              source={{ uri: item.filePath }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
        keyExtractor={(item) => item._id}
        numColumns={2} // Set number of columns for the grid
        contentContainerStyle={styles.imageListContainer}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()} // Go back to Home screen
      >
        <Text style={styles.backText}>BACK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C4CCE7",
    paddingBottom: 100,
  },
  imageListContainer: {
    padding: 10,
  },
  imageItem: {
    margin: 5,
    width: "45%", // Adjust width for list layout
  },
  image: {
    height: undefined,
    aspectRatio: 1, // Maintain aspect ratio
    borderRadius: 10,
    width: "100%", // Adjust width for list layout
  },
  button: {
    backgroundColor: "#617FE5",
    borderRadius: 10,
    padding: 10,
    margin: 35,
    alignItems: "center",
    height: 50,
    width: 250,
    bottom: -90,
    left: 50,
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default AllImagesScreen;
