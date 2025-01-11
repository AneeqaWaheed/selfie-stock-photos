import * as AuthSession from "expo-auth-session";
import { Alert } from "react-native";
import axios from "axios";

const facebookAppId = "1630716490870178"; // Replace with your Facebook App ID

export const handleFacebookLogin = async () => {
  try {
    const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
    console.log("Redirect URI:", redirectUri);

    // Correct function is AuthSession.startAsync
    const result = await AuthSession.startAsync({
      authUrl: `https://www.facebook.com/v16.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token`,
    });

    console.log("Login result:", result);

    if (result.type === "success") {
      const { access_token } = result.params;

      // Send the access token to the backend
      const response = await axios.post(
        "https://6780-103-248-222-152.ngrok-free.app/api/v1/auth/facebook", // Replace with your backend URL
        {
          accessToken: access_token,
        }
      );

      const { firebaseToken, user } = response.data;

      console.log("User saved to database:", user);
      Alert.alert("Login Successful", `Welcome, ${user.first_name}`);
      return { firebaseToken, user };
    } else {
      console.log("Login cancelled or failed");
      console.log(result); // Log the result object for more info
      return null;
    }
  } catch (error) {
    console.error("Facebook login error:", error);
    Alert.alert("Login Error", error.message);
    return null;
  }
};
//
