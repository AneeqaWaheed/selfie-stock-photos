import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";

const GoogleSignInButton = ({ onSignIn }) => {
  const [isRequestReady, setIsRequestReady] = useState(false);

  // Determine the appropriate client ID based on the platform
  const clientId = Platform.select({
    ios: "908185664888-2fvghobl00j7elqim5u99dnplul8dh2f.apps.googleusercontent.com", // iOS client ID
    android:
      "908185664888-78o232ikpb9q1d65fsbcb0fpidejel65.apps.googleusercontent.com", // Android client ID
    web: "908185664888-26csocrh0atqjsrigs0drqugrctg233e.apps.googleusercontent.com", // Web client ID
  });
  const redirectUri = makeRedirectUri({
    useProxy: true, // Use Expo's proxy for development
    ios: "https://auth.expo.io/@ayesha/ayesha", // iOS redirect URI
    android: "https://auth.expo.io/@ayesha/ayesha", // Android redirect URI
    web: "https://auth.expo.io/@ayesha/ayesha", // Web redirect URI
  });

  // Use expo-auth-session for authentication
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ["profile", "email"],
      redirectUri,
    },
    {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
    }
  );

  // Log the request and response for debugging
  useEffect(() => {
    console.log("Request:", request);
    console.log("Response:", response);
    if (request) {
      setIsRequestReady(true);
    }
  }, [request, response]);

  // Handle the response from the authentication request
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token, email, name, picture } = response.params;
      // Send the ID token to your backend
      const sendTokenToBackend = async () => {
        try {
          const response = await fetch(
            "https://6780-103-248-222-152.ngrok-free.app/api/v1/auth/google-auth",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                idToken: id_token, // Send the ID token
                email: email, // Send the email
                displayName: name, // Send the name
                photoURL: picture, // Send the photo URL
              }),
            }
          );
          const data = await response.json();
          console.log(data); // Handle the response from your backend
        } catch (error) {
          console.error("Error sending token to backend:", error);
        }
      };

      sendTokenToBackend();
      onSignIn(id_token); // Pass the ID token or user info to the parent component
    } else if (response?.type === "error") {
      console.error("Google Sign-In Error:", response.error);
    }
  }, [response]);

  return (
    <TouchableOpacity
      onPress={() => {
        console.log("button pressed");
        console.log("Request ready:", isRequestReady);
        if (isRequestReady) {
          console.log("Prompting Google Sign-In...");
          promptAsync(); // Trigger the Google Sign-In if the request is ready
        } else {
          console.log("Request not ready yet");
        }
      }}
    >
      <FontAwesome name="google" size={32} color="#ffffff" />
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;
