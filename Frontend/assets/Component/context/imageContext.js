import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ImagesContext = createContext();

const ImagesProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    try {
      // const token = await AsyncStorage.getItem("token"); // Get auth token
      const response = await axios.get(
        `https://8505-103-248-222-152.ngrok-free.app/api/images/all-images`
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      // Process the image paths and construct full image URLs
      const imagesData = response.data.map((img) => ({
        ...img,
        imageUrl: `https://8505-103-248-222-152.ngrok-free.app/${img.filePath.replace(
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

  useEffect(() => {
    fetchImages(); // Fetch images on mount
  }, []);

  return (
    <ImagesContext.Provider
      value={{ images, setImages, loading, error, fetchImages }}
    >
      {children}
    </ImagesContext.Provider>
  );
};

export default ImagesProvider;
