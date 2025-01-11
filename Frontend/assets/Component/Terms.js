import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // For icons

const TermsAndConditions = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with Back Button */}
      <View style={styles.header}>
        {/* Back Button with Triangle Icon */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.headerText}>TERMS AND CONDITIONS</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          License of photos in Selfie Stock Photos:
        </Text>
        <Text style={styles.infoText}>- Royalty Free</Text>
        <Text style={styles.infoText}>- Non-exclusive</Text>

        <Text style={styles.sectionTitle}>Types of usage:</Text>
        <Text style={styles.infoText}>- Editorial</Text>
        <Text style={styles.infoText}>- Commercial</Text>

        <Text style={styles.sectionTitle}>Purchasing:</Text>
        <Text style={styles.infoText}>
          - Purchase Selfie Stock Photos by photo resolution.
        </Text>
        <Text style={styles.infoText}>
          - Select the photo pixel size and purchase with your credit card or
          PayPal.
        </Text>

        <Text style={styles.sectionTitle}>Income:</Text>
        <Text style={styles.infoText}>
          - We will transfer your income to you on your first purchase. You will
          get 75% of each photo purchased. Example: On a $10.00 purchase you get
          $8.00. This fee will be wired to the bank account you prefer or
          PayPal.
        </Text>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("Search")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="search" size={24} color="#4468c1" />
            <Text style={styles.footerText}>SEARCH</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("MyWorks")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="briefcase" size={24} color="#4468c1" />
            <Text style={styles.footerText}>MY WORK</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("Camera")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="camera" size={24} color="#4468c1" />
            <Text style={styles.footerText}>CAMERA</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("Notifications")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="notifications" size={24} color="#4468c1" />
            <Text style={styles.footerText}>NOTIFICATIONS</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("Account")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="person" size={24} color="#4468c1" />
            <Text style={styles.footerText}>ACCOUNT</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C4CCE7", // Set background color to light blue
  },
  header: {
    backgroundColor: "#4468c1",
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  backButton: {
    position: "absolute",
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4468c1",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 0,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    marginTop: -2,
  },
  infoText: {
    fontSize: 20,
    color: "#555",
    marginBottom: 10,
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
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

export default TermsAndConditions;
