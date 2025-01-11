import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { ImagesContext } from "./context/imageContext";

export default function ImageUploadScreen() {
  const { setImages } = useContext(ImagesContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [tags, setTags] = useState(""); // Store tags input
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const animateDots = () => {
    Animated.sequence([
      Animated.timing(dot1Anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dot2Anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dot3Anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dot1Anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dot2Anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dot3Anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (uploading) animateDots();
    });
  };

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to capture an image using the camera
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access the camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to upload the image along with metadata
  const uploadImage = async () => {
    if (!image) {
      console.log("Please upload an image"); // Logs a message if no image is provided
      return;
    }

    setUploading(true);
    setUploadComplete(false);

    const formData = new FormData();
    const filename = image.split("/").pop();
    const type = `image/${filename.split(".").pop()}`;

    // Append the image properly
    formData.append("image", {
      uri: image, // Path to the image
      name: filename, // File name
      type, // MIME type
    });

    // Append other fields
    formData.append("tags", tags);

    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await axios.post(
        `https://6780-103-248-222-152.ngrok-free.app/api/images/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const newImage = {
          ...response.data,
          imageUrl: `https://6780-103-248-222-152.ngrok-free.app/${response.data.filePath.replace(
            /\\/g,
            "/"
          )}`,
        };

        console.log("response", response.data);
        setImages((prevImages) => [...prevImages, response.data]);
        Alert.alert("Upload successful!", response.data.message);
        setUploadComplete(true);
        navigation.navigate("Homelist");
      } else {
        Alert.alert("Upload failed!", response.data.message);
      }
    } catch (error) {
      console.error("AxiosError:", error.message);
      console.error("Error Details:", error.toJSON()); // Converts the error object to a readable format
      console.log("Form Data Sent:", formData);
      console.log("Token:", token);

      Alert.alert(
        "Upload failed!",
        "A network error occurred while uploading the image. Please try again."
      );
    } finally {
      setUploading(false);
      setImage(null); // Reset the image
      setTags(""); // Reset tags
    }
  };

  return (
    <View style={styles.container}>
      {/* Image Preview */}
      {image && (
        <View style={styles.imageContainer}>
          {/* Blur the image if uploading */}
          {uploading ? (
            <BlurView intensity={80} style={styles.image}>
              <Image source={{ uri: image }} style={styles.image} />
            </BlurView>
          ) : (
            <Image source={{ uri: image }} style={styles.image} />
          )}

          {/* Uploading State */}
          {uploading && (
            <View style={styles.overlay}>
              <Text style={styles.uploadingText}>
                Uploading your masterpiece
              </Text>

              <View style={styles.dotsContainer}>
                <Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
                <Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
                <Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
              </View>
            </View>
          )}

          {/* Upload Complete State */}
          {uploadComplete && (
            <View style={styles.overlay}>
              <Text style={styles.completeText}>Upload Complete! 😊</Text>
            </View>
          )}
        </View>
      )}

      {/* Show Tags and Upload Button Only if an Image is Selected */}
      {image && !uploading && !uploadComplete && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Tags (comma-separated)"
            placeholderTextColor="#aaa"
            value={tags}
            onChangeText={setTags}
          />

          <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
            <Text style={styles.uploadButtonText}>UPLOAD</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Camera Capture and Pick Image Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
          <Text style={styles.pickButtonText}>Pick an Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <Text style={styles.captureButtonText}>Take a Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C4CCE7",
  },
  imageContainer: {
    width: 300,
    height: 300,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  uploadingText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
  completeText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    color: "white",
    backgroundColor: "#333",
    textAlign: "center",
  },
  uploadButton: {
    backgroundColor: "#FFC107",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 20,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  pickButton: {
    backgroundColor: "#617FE5",
    padding: 15,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  pickButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  captureButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  captureButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
