import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For icons

const ContactUsScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    Alert.alert('Success', 'Your message has been sent successfully.');
    console.log('Form Submitted:', { name, email, message });

    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  const handleMessageChange = (text) => {
    if (text.length <= 200) {
      setMessage(text);
    }
    setIsSubmitDisabled(text.length === 200);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      {/* Contact Info */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.contactInfo}>
          <Text style={styles.subHeader}>Selfie Stock Photos:</Text>
          <Text style={styles.text}>Tel: 1 (310) 821 1775</Text>
          <Text style={styles.text}>Email: artsims@1124design.com</Text>
          <Text style={styles.text}>Playa Del Rey, California</Text>
          <Text style={styles.text}>
            Any comments and suggestions are welcome and necessary for us to provide a better marketplace and community for mobile photographers worldwide.
          </Text>
          <Text style={styles.subHeader}>Art Sims</Text>
          <Text style={styles.text}>Creator and CEO of Selfie Stock Photos</Text>
          <Text style={styles.text}>Playa Del Rey, California, USA</Text>
        </View>

        {/* Contact Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Contact Form</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Message"
            value={message}
            onChangeText={handleMessageChange}
            multiline
            maxLength={200}
          />
          <Text style={styles.charCount}>{message.length}/200</Text>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4468c1',
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 35, // To center align title with back button
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  contactInfo: {
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
    color: '#555',
    marginBottom: 8,
    lineHeight:21
  },
  formContainer: {
    marginTop: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  charCount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4468c1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ContactUsScreen;
