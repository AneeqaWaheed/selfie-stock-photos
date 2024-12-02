import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
const PaymentScreen = ({ route, navigation }) => {
  const { filename, size, image } = route.params; // Receive details from ImageDetailsScreen
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const { confirmPayment } = useStripe();

  // Fetch PaymentIntent client_secret from the backend
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.post(
          `https://8505-103-248-222-152.ngrok-free.app/api/payment/create-session?filename=${filename}`,

          {
            params: { filename },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("response:", response.data);
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        if (error.response) {
          console.error("Response error:", error.response.data);
          Alert.alert(
            "Error",
            error.response.data.message || "Payment initialization failed."
          );
        } else {
          console.error("Error:", error.message);
          Alert.alert("Error", "An unexpected error occurred.");
        }
      }
    };

    fetchPaymentIntent();
  }, [filename, size, image]);

  const handlePayPress = async () => {
    if (!clientSecret) {
      Alert.alert("Error", "Payment details are missing.");
      return;
    }

    setLoading(true);

    // Confirm the payment with the card details
    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      paymentMethodType: "Card",
      paymentMethodData: {
        billingDetails: {
          name: name, // User's name
          email: email, // User's email
          phone: "+92437648604",
        },
      },
    });

    setLoading(false);

    if (error) {
      console.error("Payment confirmation error:", error);
      Alert.alert("Payment Failed", error.message);
    } else if (paymentIntent) {
      // Payment successful
      Alert.alert("Payment Success", "Your payment was successful!");

      try {
        // Fetch the download URL from your backend
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `https://8505-103-248-222-152.ngrok-free.app/api/payment/checkout-success?filename=${filename}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.firebaseURL) {
          // Automatically download the image
          await downloadImage(response.data.firebaseURL);
        } else {
          Alert.alert("Error", "Image download failed.");
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        Alert.alert("Error", "Failed to fetch the image URL.");
      }

      navigation.goBack(); // Navigate back to the previous screen
    }
  };

  // Download Image Functionality
  const downloadImage = async (imageUrl) => {
    try {
      const hasPermission = await MediaLibrary.requestPermissionsAsync();
      if (hasPermission.status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Gallery access is required to download images."
        );
        return;
      }

      const fileUri = FileSystem.documentDirectory + filename;
      const downloadedFile = await FileSystem.downloadAsync(imageUrl, fileUri);

      const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);
      await MediaLibrary.createAlbumAsync("Downloaded Images", asset, false);

      Alert.alert("Success", "Image downloaded to your gallery!");
    } catch (error) {
      console.error("Error downloading image:", error);
      Alert.alert("Error", "Failed to download image.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Payment</Text>
      {clientSecret ? (
        <>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Card Details</Text>
          <CardField
            postalCodeEnabled={true}
            placeholder={{ number: "4242 4242 4242 4242" }}
            cardStyle={styles.card}
            style={styles.cardContainer}
          />
          <TouchableOpacity style={styles.payButton} onPress={handlePayPress}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>Pay Now</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <ActivityIndicator size="large" color="#000" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#EDEEF1",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
  card: {
    backgroundColor: "#efefef",
  },
  payButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  input: {
    borderWidth: 1, // Grey border
    borderColor: "#ccc", // Light grey color
    backgroundColor: "#fff", // White background
    borderRadius: 8, // Rounded corners
    padding: 15, // Inner padding for the input text
    marginVertical: 10, // Vertical margin between inputs
    fontSize: 16, // Text size for better readability
    color: "#333", // Dark grey text color
  },
  label: {
    color: "#555", // Light black/dark grey color
    fontSize: 16, // Font size for readability
    fontWeight: "bold", // Optional: Makes the label more prominent
    marginBottom: 5, // Space between the label and the input
  },
});

export default PaymentScreen;
