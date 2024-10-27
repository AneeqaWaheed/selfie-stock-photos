// GoogleSignInButton.js

import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const GoogleSignInButton = () => {
  const [userInfo, setUserInfo] = useState(null);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices(); // Ensure Google Play services are available
      const userInfo = await GoogleSignin.signIn(); // Perform the sign-in

      // Send ID token to your backend
      const response = await fetch("http://localhost:5000/api/v1/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: userInfo.idToken, // Send the ID token to the backend
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Logged in successfully!");
        setUserInfo(data.user); // Store user data in state or AsyncStorage if needed
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  // Configure Google Sign-in on component mount
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "499017505078-5t4tr7gbv5p7dm5ln9bj6ufgqaspi8nk.apps.googleusercontent.com",
    });
  }, []);

  return (
    <View>
      <TouchableOpacity onPress={signIn} style={{ padding: 10 }}>
        <FontAwesome name="google" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default GoogleSignInButton;
