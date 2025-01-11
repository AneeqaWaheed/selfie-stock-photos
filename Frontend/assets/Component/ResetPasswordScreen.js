import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email, otp } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    try {
      const response = await axios.post(
        "https://6780-103-248-222-152.ngrok-free.app/api/v1/auth/reset-password",
        {
          email,
          otp,
          password,
        }
      );
      Alert.alert("Success", response.data.message);
      navigation.navigate("Login");
      // Redirect user to login screen
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong"
      );
      console.log("vbjhjh", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.p1Content}>
        <Text style={styles.sloganText}>Selfie Stock Photos</Text>
      </View>
      <View>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.signinButton}
          onPress={handleResetPassword}
        >
          <Text style={styles.signInText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    padding: 20,
    backgroundColor: "#EDEEF1",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  signinButton: {
    backgroundColor: "#E8B93A",
    borderRadius: 25,
    paddingVertical: 15,
    width: 207,
    alignItems: "center",
    alignSelf: "center", // Center horizontally
    marginTop: 20, // Add some spacing from the input
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  p1Content: {
    alignItems: "center",
    marginTop: 20, // Minimal margin from the top
  },
  sloganText: {
    fontSize: 20,
    color: "#333", // Darker color for better readability
    textAlign: "center",
    fontWeight: "600",
  },
});

export default ResetPasswordScreen;
