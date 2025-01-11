import { initializeApp } from "firebase/app";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDu0EXrDYRiwnY_iLv-ESMKwpyw35Ca1Sc",
  authDomain: "burgershop-2975b.firebaseapp.com",
  projectId: "burgershop-2975b",
  storageBucket: "burgershop-2975b.appspot.com",
  messagingSenderId: "908185664888",
  appId: "1:908185664888:web:af2f96c792da4162e0dc8d",
};

// Configure Google Sign-In
// GoogleSignin.configure({
//   webClientId:
//     "908185664888-26csocrh0atqjsrigs0drqugrctg233e.apps.googleusercontent.com", // From Firebase Console
// });
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
