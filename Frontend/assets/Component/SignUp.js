import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const phoneAnim = useRef(new Animated.Value(0)).current;
  const welcomeMoveAnim = useRef(new Animated.Value(0)).current;
  const iphoneOpacity = useRef(new Animated.Value(1)).current;

  const translateYPhone = phoneAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  const translateXPhone = phoneAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const translateWelcome = welcomeMoveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  const opacityWelcome = welcomeMoveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const validateFields = () => {
    if (!firstName || !lastName || !email || !password || !reEnterPassword || !bio || !username) {
      Alert.alert('All fields are required');
      return false;
    }
    if (password !== reEnterPassword) {
      Alert.alert('Passwords do not match');
      return false;
    }
    return true;
  };

  const clearPreviousToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Error clearing previous token:', error);
    }
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    await clearPreviousToken();

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('bio', bio);
    if (profileImage) {
      formData.append('profileImage', {
        uri: profileImage,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    }

    try {
      const response = await fetch('http://192.168.100.186:5000/api/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.status === 201) {
        handleLoginAfterRegister(email, password);
      } else {
        Alert.alert('Error registering user', data.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error registering user', error.message);
    }
  };

  const handleLoginAfterRegister = async (email, password) => {
    try {
      const loginResponse = await fetch('http://192.168.100.186:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();
      if (loginResponse.status === 200) {
        await AsyncStorage.setItem('token', loginData.token);
        Alert.alert('Registration and login successful', 'Welcome!');
        navigation.navigate('MyWork');
      } else {
        Alert.alert('Login failed', loginData.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error logging in user', error.message);
    }
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(phoneAnim, {
        toValue: 0.5,
        duration: 1000,
        delay: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(phoneAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(welcomeMoveAnim, {
        toValue: 1,
        duration: 500,
        delay: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(iphoneOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.socialIconsContainer}>
          <Text style={styles.verticalText}>or sign up with</Text>
          <View style={styles.iconCircle}>
            <FontAwesome name="facebook" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.iconCircle}>
            <FontAwesome name="google" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.iconCircle}>
            <FontAwesome name="twitter" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.iconCircle}>
            <FontAwesome name="instagram" size={22} color="#FFFFFF" />
          </View>
        </View>

        <Animated.Image
          source={require('../../assets/Images/Iphone.png')}
          style={[
            styles.iphoneImage,
            {
              transform: [{ translateY: translateYPhone }, { translateX: translateXPhone }],
              opacity: iphoneOpacity,
            },
          ]}
          resizeMode="contain"
        />

        <Animated.Text
          style={[
            styles.welcomeText,
            {
              transform: [{ translateX: translateWelcome }],
              opacity: opacityWelcome,
            },
          ]}
        >
          Welcome!
        </Animated.Text>

        <Animated.View style={[styles.formContainer, { opacity: phoneAnim }]}>
          <Text style={styles.signUpTitle}>Sign up</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#fff"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#fff"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#fff"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Re-enter Password"
            secureTextEntry
            placeholderTextColor="#fff"
            value={reEnterPassword}
            onChangeText={setReEnterPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Bio"
            placeholderTextColor="#fff"
            value={bio}
            onChangeText={setBio}
          />
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Text style={styles.imagePickerText}>
              {profileImage ? 'Change Profile Image' : 'Pick a Profile Image'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.nextButtonContainer, { opacity: phoneAnim }]}>
          <TouchableOpacity style={styles.nextButton} onPress={handleRegister}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#C4CCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconsContainer: {
    position: 'absolute',
    left: '-7%',
    top: '58%',
    alignItems: 'center',
  },
  verticalText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
    transform: [{ rotate: '-90deg' }],
    marginBottom: 20,
    left: -50,
    top: '50%',
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iphoneImage: {
    width: 250,
    height: 270,
    position: 'absolute',
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    position: 'absolute',
    bottom: '30%',
    left: '70%',
    opacity: 0,
  },
  formContainer: {
    position: 'absolute',
    top: '5%',
    alignItems: 'center',
    width: '80%',
    opacity: 0,
  },
  signUpTitle: {
    fontSize: 35,
    marginBottom: -10,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    padding: 8,
    width: '100%',
    marginBottom: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: '15%',
    left: '74%',
  },
  nextButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePickerButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 3,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#FFFFFF',
  },
});

export default SignUpScreen;
