import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // For icons

const Aboutus = ({ navigation }) => {
  // Handle navigation
  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  // Data for photo sizes and costs
  const photoData = [
    { size: "1500px", maxDimensions: "1500x1500", cost: "$25" },
    { size: "3000px", maxDimensions: "3000x3000", cost: "$25" },
    { size: "5000px", maxDimensions: "5000x5000", cost: "$25" },
    { size: "8000px", maxDimensions: "8000x8000", cost: "$25" },
  ];

  // Data for main content text
  const contentData = [
    { key: "text1", text: "You take wonderful photos" },
    { key: "text2", text: "why don’t you sell them?" },
    {
      key: "text3",
      text: "Selfie Stock Photos is a stock marketplace for mobile photographers.",
    },
    { key: "step1", text: "Step One: take a beautiful photo", isBold: true },
    {
      key: "step2",
      text: "Step Two: upload to Selfie Stock Photo",
      isBold: true,
    },
    {
      key: "step3",
      text: "Step Three: your photos will be available to thousands of designers, marketers, social media managers, and vast amounts of online networks.",
    },
    { key: "commission", text: "Your commission rate is 75%" },
    {
      key: "purchase",
      text: "Once you purchase a photo, your connected bank account or PayPal will be charged, pending your preference.",
    },
  ];

  // Render main content text
  const renderContent = ({ item }) => (
    <Text style={[styles.infoText, item.isBold && styles.boldText]}>
      {item.text}
    </Text>
  );

  // Render the photo table
  const renderPhotoTable = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.size}</Text>
      <Text style={styles.tableCell}>{item.maxDimensions}</Text>
      <Text style={styles.tableCell}>{item.cost}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </View>
      </TouchableOpacity>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.aboutSection}>
          <Text style={styles.aboutText}>ABOUT US</Text>
        </View>

        <Text style={styles.centeredText1}>You take wonderful photos</Text>
        <Text style={styles.centeredText}>why don’t you sell them?</Text>
        <Text style={styles.infoText1}>
          Selfie Stock Photos is a stock marketplace for mobile photographers.
        </Text>
        <Text style={[styles.infoText, styles.boldText]}>
          Step One: take a beautiful photo
        </Text>
        <Text style={styles.infoText}>
          Step Two: upload to Selfie Stock Photo
        </Text>
        <Text style={[styles.infoText, styles.boldText]}>
          Step Three: your photos will be available to thousands of designers,
          marketers, social media managers, and vast amounts of online networks.
        </Text>
        <Text style={styles.infoText}>Your commission rate is 75%</Text>
        <Text style={styles.infoText}>
          Once you purchase a photo, your connected bank account or PayPal will
          be charged, pending your preference.
        </Text>

        {/* Photo Sizes and Costs Table */}
        <Text style={styles.tableHeader}>Photo Sizes & Costs</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.border]}>Size</Text>
            <Text style={[styles.tableHeaderCell, styles.border]}>
              Max Dimensions
            </Text>
            <Text style={[styles.tableHeaderCell, styles.border]}>Cost</Text>
          </View>
          <FlatList
            data={photoData}
            renderItem={renderPhotoTable}
            keyExtractor={(item) => item.size}
          />
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigateTo("Search")}
        >
          <Ionicons name="search" size={24} color="#4468c1" />
          <Text style={styles.footerText}>SEARCH</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigateTo("MyWorks")}
        >
          <Ionicons name="briefcase" size={24} color="#4468c1" />
          <Text style={styles.footerText}>MY WORK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigateTo("Camera")}
        >
          <Ionicons name="camera" size={24} color="#4468c1" />
          <Text style={styles.footerText}>CAMERA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigateTo("Notifications")}
        >
          <Ionicons name="notifications" size={24} color="#4468c1" />
          <Text style={styles.footerText}>NOTIFICATIONS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigateTo("Account")}
        >
          <Ionicons name="person" size={24} color="#4468c1" />
          <Text style={styles.footerText}>ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C4CCE7", // Background color for the screen
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center", // Align the icon and text vertically
    backgroundColor: "transparent",
    zIndex: 1,
  },
  backText: {
    color: "#fff", // White color for text
    fontSize: 18,
    marginLeft: -3, // Space between icon and text
  },
  mainContent: {
    marginTop: 20, // Adds some space at the top of the screen
  },
  aboutSection: {
    backgroundColor: "#4468c1", // Background color for "ABOUT US"
    paddingVertical: 20,
    marginVertical: -30,
    marginHorizontal: 0,
    borderRadius: 5,
    alignItems: "center",
  },
  aboutText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    top: 7,
  },
  centeredText: {
    fontSize: 24, // Increased font size for better visibility
    color: "#333",
    textAlign: "center",
    marginBottom: 55,
    fontWeight: "bold", // Increased prominence
    marginHorizontal: 20, // Added horizontal margin for spacing
  },
  centeredText1: {
    top: 55,
    fontSize: 24, // Increased font size for better visibility
    color: "#333",
    textAlign: "center",
    marginBottom: 75,
    fontWeight: "bold", // Increased prominence
    marginHorizontal: 30, // Added horizontal margin for spacing
  },
  infoText: {
    fontSize: 20,
    color: "#333",
    marginBottom: 15,
    lineHeight: 22,
    marginHorizontal: 20, // Added horizontal margin for spacing
  },
  infoText1: {
    fontSize: 24,
    color: "#333",
    marginBottom: 25,
    lineHeight: 26,
    marginHorizontal: 20, // Added horizontal margin for spacing
    fontWeight: "700",
    top: -20,
  },

  tableHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#4468c1",
    marginHorizontal: 20, // Added horizontal margin for spacing
  },
  tableContainer: {
    backgroundColor: "#fff", // White background for the table container
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f4f7fb",
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#617FE5", // Color for table header text
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    justifyContent: "space-between",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  footerItem: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#4468c1",
    marginTop: 5,
  },
});

export default Aboutus;
