import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const BuyerSellerGuideScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Buyer & Seller Guide</Text>
      </View>

      {/* Main Content - Buyer & Seller Guide */}
      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Photographers can upload photos free of charge.
          {"\n\n"}
          All photos in Selfie Stock Photos are royalty free. The app references
          a copyright license in which the user has the right to use the picture
          without many restrictions based on a one-time payment to the licensor.
          {"\n\n"}
          The user can therefore use the image in several projects without
          having to purchase any additional licenses. Licenses cannot be given
          on an exclusive basis. The copyright owner of the photos can sell the
          photos to other buyers.
          {"\n\n"}
          Watermarks are prohibited.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4468c1",
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginRight: 35,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 20,
    lineHeight: 24,
    color: "#555",
    marginBottom: 20,
  },
  navButtons: {
    marginTop: 20,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4468c1",
    paddingVertical: 12,
    marginVertical: 5,
    borderRadius: 8,
    justifyContent: "center",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default BuyerSellerGuideScreen;
