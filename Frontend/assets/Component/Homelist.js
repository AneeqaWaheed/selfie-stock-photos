import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  ImageBackground,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
  Alert,
  StyleSheet, // Add StyleSheet import here
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImagesContext } from "./context/imageContext";
import { fetchSearchedImages } from "./apiCall/searchImages";
import debounce from "lodash.debounce";
const HomeScreen = () => {
  const navigation = useNavigation();

  const { images, loading, setImages, error, fetchImages } =
    useContext(ImagesContext);
  const [numColumns, setNumColumns] = useState(2);

  const [searchQuery, setSearchQuery] = useState("");

  const performSearch = async (query) => {
    try {
      if (query.trim() === "") {
        // Fetch all images if query is empty
        await fetchImages();
      } else {
        // Fetch searched images
        const results = await fetchSearchedImages(query);
        setImages(results);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      Alert.alert("Error fetching images");
    }
  };

  // Debounced search handler
  const debouncedSearch = debounce((query) => {
    performSearch(query);
  }, 300); // 300ms debounce delay

  // Watch for changes in the search query
  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel(); // Cleanup debounce on unmount
  }, [searchQuery]);

  // Fetch uploader profile by image ID
  const fetchImageProfile = async (imageId) => {
    try {
      const response = await axios.get(
        `https://8505-103-248-222-152.ngrok-free.app/api/profile/image-profile/${imageId}/uploader`
      );
      console.log("Fetched Profile:", response.data);
      return response.data; // Return the profile data
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error fetching profile");
      return null; // Return null if there's an error
    }
  };

  const handleImagePress = async (image) => {
    const profile = await fetchImageProfile(image._id); // Fetch uploader's profile
    if (profile) {
      navigation.navigate("ImageDetails", {
        image: image, // Pass image details
        uploader: profile, // Pass uploader profile details
      });
    }
  };

  if (loading) {
    return <Text>Loading...</Text>; // Optionally add a loading indicator
  }

  if (error) {
    return <Text>{error}</Text>; // Display error message
  }
  return (
    <>
      <StatusBar hidden={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImageBackground
          source={require("../../assets/Images/Homeheader.png")}
          style={styles.waveImage}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/Images/logoimg.png")}
              style={styles.logoImage}
            />
          </View>
        </ImageBackground>

        <View style={styles.searchInputContainer}>
          <Image
            source={require("../../assets/Images/search.png")}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search images"
            placeholderTextColor="#FFFFFF"
            style={styles.searchInput}
            textAlign="center"
            value={searchQuery}
            onChangeText={setSearchQuery} // Update search query state
          />
          {/* <TouchableOpacity
            style={styles.dropdownButton}
            onPress={handleSearch}
          >
            <Image
              source={require("../../assets/Images/dropdown.png")}
              style={styles.dropdownIcon}
            />
          </TouchableOpacity> */}
        </View>

        <View style={styles.viewOptionsContainer}>
          <Text style={styles.viewText}>VIEW</Text>
          <TouchableOpacity
            style={styles.viewOption}
            onPress={() => setNumColumns(2)} // Set to 2 for grid view
          >
            <Image
              source={require("../../assets/Images/grid.png")}
              style={styles.viewIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewOption}
            onPress={() => setNumColumns(1)} // Set to 1 for list view
          >
            <Image
              source={require("../../assets/Images/list.png")}
              style={styles.viewIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Image List */}
        <FlatList
          key={numColumns} // Re-render when numColumns changes
          data={images}
          keyExtractor={(item) => item._id}
          numColumns={numColumns}
          contentContainerStyle={styles.imageListContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.imageItem}
              onPress={() => handleImagePress(item)} // Call handleImagePress on press
            >
              <View>
                <Image
                  source={{
                    uri: `https://8505-103-248-222-152.ngrok-free.app/${item.filePath.replace(
                      /\\/g,
                      "/"
                    )}`,
                  }}
                  style={styles.image}
                  onError={(error) => {
                    console.log(
                      "Image loading error:",
                      error.nativeEvent.error
                    );
                  }}
                />
              </View>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AllImages")}
        >
          <Text style={styles.seeMoreText}>SEE MORE</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("MyWork")}
        >
          <Image
            source={require("../../assets/Images/My Photos.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>MY WORKS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Camera")}
        >
          <Image
            source={require("../../assets/Images/Camera.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>CAMERA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Notifications")}
        >
          <Image
            source={require("../../assets/Images/Notifications.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>NOTIFICATIONS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Account")}
        >
          <Image
            source={require("../../assets/Images/Account.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 100,
    backgroundColor: "#C4CCE7",
  },
  waveImage: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    paddingTop: 40,
  },
  logoImage: {
    width: 150,
    height: 150,
    top: "7%",
    resizeMode: "contain",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 10,
    width: "90%",
    justifyContent: "center",
    height: 100,
    marginHorizontal: 10,
  },
  backButton: {
    marginRight: 10,
    top: -45,
    left: 65,
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(158, 170, 211, 0.39)",
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 22,
    width: 370,
    height: 60,
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginRight: 7,
    resizeMode: "contain",
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 22,
    top: 2,
    fontWeight: "bold",
  },
  dropdownButton: {
    paddingHorizontal: 5,
  },
  dropdownIcon: {
    width: 30,
    height: 25,
    resizeMode: "contain",
  },
  viewOptionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  viewText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginRight: "-90%",
    fontWeight: "bold",
    top: -20,
  },
  viewOption: {
    marginHorizontal: 2,
  },
  imageListContainer: {
    margin: 0,
    padding: 0,
  },
  imageItem: {
    flex: 1, // Adjust to fit the container
    margin: 0, // Remove margins
    padding: 0, // Remove padding
  },
  image: {
    height: 170,
    borderRadius: 0,
    width: "100%",
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignSelf: "center",
    marginVertical: 25,
  },
  seeMoreText: {
    color: "#617FE5",
    fontSize: 16,
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "rgba(97, 127, 229, 0.9)",
    height: 70,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 25,
    height: 25,
    tintColor: "#FFFFFF",
  },
  navText: {
    color: "#FFFFFF",
    fontSize: 10,
  },
  viewIcon: {
    height: 30,
    width: 30,
    left: 330,
    top: 10,
  },
});

export default HomeScreen;
