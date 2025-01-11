import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // For icons

const Account = ({ navigation }) => {
  // Handle navigation
  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Back Button with Triangle Icon and "Back" Text */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.aboutSection}>
          <Text style={styles.aboutText}>Account</Text>
        </View>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigateTo("Setting")}
        >
          <Ionicons name="search" size={24} color="#4468c1" />
          <Text style={styles.footerText}>Setting</Text>
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
    fontWeight: 700,
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

export default Account;
