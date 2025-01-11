import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Appbar, Text, Divider, Switch } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SettingsScreen = ({ navigation }) => {
  const [isInvisibleMode, setIsInvisibleMode] = React.useState(false);

  const toggleInvisibleMode = () => {
    setIsInvisibleMode(!isInvisibleMode);
  };

  // Bottom navigation button handlers
  const navigateToSearch = () => navigation.navigate("Search");
  const navigateToMyViews = () => navigation.navigate("MyWork");
  const navigateToCamera = () => navigation.navigate("Camera");
  const navigateToNotifications = () => navigation.navigate("Notifications");
  const navigateToAccount = () => navigation.navigate("Account");

  // Handlers for the new screens
  // const navigateToAboutUs = () => navigation.navigate("Aboutus");
  const navigateToBuyerSellerScreen = () =>
    navigation.navigate("BuyerSellerScreen");
  const navigateToTermsConditions = () => navigation.navigate("Terms");
  const navigateToPrivacyPolicy = () => navigation.navigate("Privacy");
  const navigateToContactUs = () => navigation.navigate("Contact");

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {/* Appbar */}
      <Appbar.Header style={styles.appbar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-left" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.backText} onPress={() => navigation.goBack()}>
          Back
        </Text>
        <Appbar.Content title="SETTINGS" titleStyle={styles.title} />
        <Appbar.Action icon="cog" onPress={() => {}} color="#fff" />
      </Appbar.Header>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Options List */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigateTo("Aboutus")}
          >
            <Text style={styles.optionText}>About Us</Text>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity
            style={styles.option}
            onPress={navigateToBuyerSellerScreen}
          >
            <Text style={styles.optionText}>Buyer & Seller Guide</Text>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity
            style={styles.option}
            onPress={navigateToTermsConditions}
          >
            <Text style={styles.optionText}>Terms and Conditions</Text>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity
            style={styles.option}
            onPress={navigateToPrivacyPolicy}
          >
            <Text style={styles.optionText}>Privacy Policy</Text>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity style={styles.option} onPress={navigateToContactUs}>
            <Text style={styles.optionText}>Contact Us</Text>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Privacy Section */}
        <View style={styles.privacySection}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Invisible Mode</Text>
            <Switch
              value={isInvisibleMode}
              onValueChange={toggleInvisibleMode}
              color="#4f83cc"
            />
          </View>
          <Text style={styles.privacyNote}>
            If you don’t want anyone to know you are online, hide your presence
            with Invisible Mode.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={navigateToSearch}>
          <Icon name="magnify" size={28} color="#fff" />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={navigateToMyViews}>
          <Icon name="view-list" size={28} color="#fff" />
          <Text style={styles.navText}>My Views</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={navigateToCamera}>
          <Icon name="camera" size={28} color="#fff" />
          <Text style={styles.navText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={navigateToNotifications}
        >
          <Icon name="bell" size={28} color="#fff" />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={navigateToAccount}>
          <Icon name="account" size={28} color="#fff" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(97, 127, 229, 0.7)",
  },
  appbar: {
    backgroundColor: "#4f83cc",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingLeft: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: -2,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 40,
    borderRadius: 8,
    padding: 16,
    elevation: 9,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
  },
  divider: {
    backgroundColor: "#ddd",
  },
  privacySection: {
    marginTop: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  privacyNote: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#4f83cc",
    paddingVertical: 8,
  },
  navItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
  },
});

export default SettingsScreen;
