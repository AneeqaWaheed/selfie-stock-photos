import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  ImageBackground, 
  Image, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Keyboard 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For social icons
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false); // Track keyboard visibility

  const opacityAnim = useRef(new Animated.Value(1)).current; // For the woman image fade-out
  const formAnim = useRef(new Animated.Value(0)).current;    // For the login form fade-in

  useEffect(() => {
    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    // Fade animation after 3 seconds
    setTimeout(() => {
      // Fade out the woman image
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // Fade in the login form after the woman image fades out
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 3000);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [opacityAnim, formAnim]);

  // Handle login request to backend
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please enter both email and password');
      return;
    }

    try {
      const response = await fetch('http://192.168.100.186:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Sending email and password to backend
      });

      const textResponse = await response.text(); // Get the raw response as text
      console.log('Raw response:', textResponse); // Log the raw response for debugging

      const data = JSON.parse(textResponse); // Parse JSON manually

      if (response.status === 200) {
        // Store the token in AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        console.log('Token stored:', data.token); // Debug log

        Alert.alert('Login Successful');
        // Navigate to HomeScreen (you can call it 'Dashboard' or any other name)
        navigation.navigate('Homelist'); 
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error logging in', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={[styles.container, keyboardVisible && { marginTop: -50 }]}>
        {/* Woman Image (Splash screen) */}
        <Animated.View style={[styles.imageContainer, { opacity: opacityAnim }]}>
          <ImageBackground
            source={require('../../assets/Images/main.png')}  // Replace with your woman image path
            style={styles.womanImage}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Original Login Form */}
        <Animated.View style={[styles.formContainer, { opacity: formAnim }]}>
          
          {/* Separate container for the blue gradient image */}
          <View style={styles.blueGradientContainer}>
            <ImageBackground
              source={require('../../assets/Images/login2S.png')}  // Blue gradient background
              style={styles.blueGradientImage}
              resizeMode="cover"
            >
              <View style={styles.p1Content}>
                <Text style={styles.sloganText}>You take extraordinary photos,{"\n"}why not sell them?</Text>

                <Image 
                  source={require('../../assets/Images/logoimg.png')}  // Replace with your actual logo image
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </ImageBackground>
          </View>

          {/* Login Form Content below the Blue Gradient */}
          <View style={styles.formContent}>
            {/* Email Input */}
            <TextInput 
              style={styles.input} 
              placeholder="janedoe@mail.com" 
              placeholderTextColor="#FFFFFF"
              value={email}
              onChangeText={setEmail} // Updating email state
              keyboardType="email-address"
            />

            {/* Password Input */}
            <TextInput 
              style={styles.input} 
              placeholder="Password" 
              placeholderTextColor="#FFFFFF"
              secureTextEntry 
              value={password}
              onChangeText={setPassword} // Updating password state
            />

            {/* Forgot Password */}
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity style={styles.signinButton} onPress={handleLogin}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>or</Text>

            {/* Social Icons */}
            <View style={styles.socialIconsContainer}>
              <FontAwesome name="google" size={32} color="#ffff" />
              <FontAwesome name="facebook" size={32} color="#ffff" />
              <FontAwesome name="twitter" size={32} color="#ffff" />
              <FontAwesome name="instagram" size={32} color="#ffff" />
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    backgroundColor: '#EDEEF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  womanImage: {
    width: '100%',
    height: '100%',  // The woman image covers the whole screen
  },
  formContainer: {
    marginTop: '69%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    opacity: 0, // Initially hidden (fade in later)
  },
  blueGradientContainer: {
    width: '105%',
    height: '70%',
    marginTop: '-70%',
  },
  blueGradientImage: {
    width: '99%',
    height: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '0.8%',
  },
  p1Content: {
    alignItems: 'center',
  },
  sloganText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: '10%',
  },
  logoImage: {
    width: 133,
    height: 62,
    marginTop: 20,
  },
  formContent: {
    width: '90%',
    alignItems: 'center',
    marginTop: '5%',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#FFFFFF',
    height: 40,
    width: '100%',
    color: '#FFFFFF',
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: 'transparent',
    fontWeight: '700',
    fontSize: 17,
  },
  forgotPasswordText: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: '65%',
    width: '100%',
    marginBottom: 33,
  },
  signinButton: {
    backgroundColor: '#E8B93A',
    borderRadius: 25,
    paddingVertical: 15,
    width: 207,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  orText: {
    color: '#FFFFFF',
    fontSize: 20,
    marginVertical: 17,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 10,
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10%',
  },
  footerText: {
    color: '#fff',
    fontSize: 20,
    marginRight: 5,
  },
  signUpText: {
    color: '#FFA500',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentContainerStyle: {
    backgroundColor: '#C4CCE7',
  },
});
export default LoginScreen;
