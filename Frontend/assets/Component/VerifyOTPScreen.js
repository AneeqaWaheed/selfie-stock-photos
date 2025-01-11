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

const VerifyOTPScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(
        "https://6780-103-248-222-152.ngrok-free.app/api/v1/auth/verify-otp",
        { email, otp }
      );
      Alert.alert("Success", response.data.message);
      navigation.navigate("ResetPassword", { email, otp }); // Navigate to reset password screen
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.p1Content}>
        <Text style={styles.sloganText}>Selfie Stock Photos</Text>
      </View>
      <View>
        <Text style={styles.title}>Verify OTP</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
        />
        <TouchableOpacity style={styles.signinButton} onPress={handleVerifyOTP}>
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

export default VerifyOTPScreen;
