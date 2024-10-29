import React, { useEffect } from "react";
import { Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import { RNTwitterSignIn } from "react-native-twitter-signin";
import { TWITTER_CONFIG } from "./TwitterAuthConfig";

const TwitterLoginButton = () => {
  useEffect(() => {
    RNTwitterSignIn.init(
      TWITTER_CONFIG.consumerKey,
      TWITTER_CONFIG.consumerSecret
    );
  }, []);

  const loginWithTwitter = async () => {
    try {
      const result = await RNTwitterSignIn.logIn();

      if (result) {
        const { authToken, authTokenSecret, userName, userID } = result;
        console.log("Twitter Auth Success", result);

        // Send tokens to your backend
        const response = await fetch(
          "http://localhost:5000/api/v1/auth/twitter",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ authToken, authTokenSecret }),
          }
        );

        const data = await response.json();
        if (data.success) {
          Alert.alert("Success", `Welcome, ${userName}!`);
        } else {
          Alert.alert("Error", "Authentication failed.");
        }
      }
    } catch (error) {
      console.error("Twitter Login Error", error);
      Alert.alert("Error", error.message || "Something went wrong.");
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={signIn} style={{ padding: 10 }}>
        <FontAwesome name="twitter" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default TwitterLoginButton;
