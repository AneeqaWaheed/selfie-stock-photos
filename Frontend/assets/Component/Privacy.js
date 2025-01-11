import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // For the back button icon

const PrivacyPolicyScreen = ({ navigation }) => {
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
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

        <Text style={styles.title}>Privacy Policy</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.text}>
          The following Privacy Statement is provided to you pursuant to the
          Personal Data (privacy) Ordinance of Sefie Stock Photos in connection
          with your dealings with, and provision of personal data or information
          (personal data) to Sefie Stock Photos (us, we, our) on occasion.
        </Text>

        <Text style={styles.head}>Collection:</Text>
        <Text style={styles.text}>
          1. You are required to provide Selfie Stock Photos with Personal Data
          in connection with various matters such as online subscription of our
          latest offers, transaction processing, provision of services to you or
          compliance with any laws and regulations.
        </Text>
        <Text style={styles.text}>
          2. The kind of Personal Data that may be collected includes but not
          limited to your name, personal or business contact details and account
          information.
        </Text>
        <Text style={styles.text}>
          3. Failure to supply such Personal Data may result in Selfie Stock
          Photos being unable to provide the relevant services to you.
        </Text>
        <Text style={styles.text}>
          4. It is also the case that Personal data is collected from you in the
          ordinary course of the continuation of your relationship with Selfie
          Stock Photos for example, when you transfer funds, effect transactions
          or participate in online activities with us.
        </Text>

        <Text style={styles.head}>Purpose and Use:</Text>
        <Text style={styles.text}>
          1. The purposes for which Personal Data may be used vary depending on
          the nature of your relationship with Selfie Stock Photos (including
          any third party Personal Data provided by you) for any or all of the
          following purposes: Selfie Stock Photos may use your data to provide
          you with products and services, process transactions, manage customer
          relationships, and comply with legal obligations.
        </Text>
        <Text style={styles.text}>
          2. We may use your personal data to improve our website and services,
          send you promotional offers, and provide customer support.
        </Text>

        <Text style={styles.head}>Show More Information</Text>
        <TouchableOpacity onPress={handleShowMore}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.showMoreText}>
              {showMore ? "Show Less" : "Show More"}
            </Text>
          </View>
        </TouchableOpacity>

        {showMore && (
          <View>
            <Text style={styles.text}>
              3. We may share your personal data with third-party service
              providers who assist us in providing our services, such as payment
              processors or email marketing platforms.
            </Text>
            <Text style={styles.text}>
              4. We will take all reasonable steps to ensure that your personal
              data is kept secure and used in accordance with applicable laws
              and regulations.
            </Text>
          </View>
        )}

        {/* Footer with Privacy Policy text */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Privacy Policy</Text>
          <Text style={styles.footerText}>
            For further details, please contact us at
            support@selfiestockphotos.com.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  header: {
    backgroundColor: "#4468c1",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4468c1",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
    left: -20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
    left: -5,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    flex: 1,
    left: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  showMoreText: {
    color: "#007BFF",
    fontSize: 16,
    marginTop: 10,
  },
  footer: {
    marginTop: 20,
    backgroundColor: "#f7f7f7",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  head: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
});

export default PrivacyPolicyScreen;
