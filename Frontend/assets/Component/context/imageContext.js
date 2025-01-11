import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
export const ImagesContext = createContext();

const ImagesProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null); // State to hold uploader profile data
  const [profileLoading, setProfileLoading] = useState(false); // Loading state for profile
  const [profileError, setProfileError] = useState(null); // Error state for profile
  const [isFollowing, setIsFollowing] = useState(false);
  const fetchImages = async () => {
    try {
      // const token = await AsyncStorage.getItem("token"); // Get auth token
      const response = await axios.get(
        `https://6780-103-248-222-152.ngrok-free.app/api/images/all-images`
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      // Process the image paths and construct full image URLs
      const imagesData = response.data.map((img) => ({
        ...img,
        imageUrl: `https://6780-103-248-222-152.ngrok-free.app/${img.filePath.replace(
          /\\/g,
          "/"
        )}`,
      }));

      setImages(imagesData); // Set processed images data to state
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Failed to fetch images");
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };
  const fetchImageProfile = async (imageId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token retrieved:", token);
      if (!token) {
        throw new Error("No token found in AsyncStorage");
      }

      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);

      const response = await axios.get(
        `https://6780-103-248-222-152.ngrok-free.app/api/profile/image-profile/${imageId}/uploader`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Profile response data:", response.data);

      const statusResponse = await axios.get(
        `https://6780-103-248-222-152.ngrok-free.app/api/followers/followers/status/${response.data._id}`,
        {
          params: { userId: decodedToken._id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Status response:", statusResponse.data);

      setProfile(response.data);
      setIsFollowing(statusResponse.data.isFollowing);
    } catch (error) {
      console.error(
        "Error in fetchImageProfile:",
        error.response?.data || error.message
      );
      setProfileError("Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchImages(); // Fetch images on mount
    // fetchImageProfile();
  }, []);

  return (
    <ImagesContext.Provider
      value={{
        images,
        setImages,
        loading,
        error,
        fetchImages,
        profile,
        setProfile,
        profileLoading,
        profileError,
        fetchImageProfile,
        isFollowing,
        setIsFollowing,
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};

export default ImagesProvider;
