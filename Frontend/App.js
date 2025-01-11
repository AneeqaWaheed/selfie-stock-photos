import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./assets/Component/Login"; // Update with the path to your LoginScreen
import SignupScreen from "./assets/Component/SignUp"; // Update with the path to your SignupScreen
import AllImagesScreen from "./assets/Component/AllImagesScreen";
import ImageDetailScreen from "./assets/Component/ImageDetails";
import CameraScreen from "./assets/Component/Camera";
import MyWorkScreen from "./assets/Component/MyWork";
import { StripeProvider } from "@stripe/stripe-react-native";
import Homelist from "./assets/Component/Homelist";
import PaymentScreen from "./assets/Component/PaymentScreen";
import ImagesProvider from "./assets/Component/context/imageContext";
import ForgotPasswordScreen from "./assets/Component/ForgotPassword";
import VerifyOTPScreen from "./assets/Component/VerifyOTPScreen";
import ResetPasswordScreen from "./assets/Component/ResetPasswordScreen";
import Account from "./assets/Component/Account";
import SettingsScreen from "./assets/Component/Settings";
import Aboutus from "./assets/Component/Aboutus";
import BuyerSellerGuideScreen from "./assets/Component/BuyerSellerScreen";
import TermsAndConditions from "./assets/Component/Terms";
import PrivacyPolicyScreen from "./assets/Component/Privacy";
import ContactUsScreen from "./assets/Component/Contact";
import { NotificationProvider } from "./assets/Component/context/NotificationContext";
import NotificationScreen from "./assets/Component/Notifications";
import {
  PushTokenProvider,
  UserProvider,
} from "./assets/Component/context/userContext";
const Stack = createStackNavigator();

export default function App() {
  return (
    <PushTokenProvider>
      {/* <NotificationProvider> */}
      <NavigationContainer>
        <ImagesProvider>
          <StripeProvider publishableKey="pk_test_51PEJfu01DpWcWRP0TEUVM1P0XqVY3nxhwTFN2U2XEPfyLGEj1aFbuq293hJat09xnQvTqRM9zH3DUxBzSjKgsVip00EjufZogm">
            <Stack.Navigator initialRouteName="Login">
              {/* Define Login Screen */}
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              {/* Define Signup Screen */}
              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="VerifyOTP"
                component={VerifyOTPScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Homelist"
                component={Homelist}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AllImages"
                component={AllImagesScreen}
                options={{ title: "All Images" }} // Screen title for "All Images"
              />
              <Stack.Screen
                name="ImageDetails"
                component={ImageDetailScreen}
                options={{ title: "Image Details" }}
              />
              <Stack.Screen
                name="PaymentScreen"
                component={PaymentScreen}
                options={{ title: "Payment Screen" }}
              />
              <Stack.Screen
                name="Account"
                component={Account}
                options={{ title: "Account" }}
              />
              <Stack.Screen
                name="Setting"
                component={SettingsScreen}
                options={{ title: "SettingsScreen" }}
              />
              <Stack.Screen
                name="Aboutus"
                component={Aboutus}
                options={{ title: "Aboutus" }}
              />
              <Stack.Screen
                name="BuyerSellerScreen"
                component={BuyerSellerGuideScreen}
                options={{ title: "BuyerSellerGuideScreen" }}
              />
              <Stack.Screen
                name="Terms"
                component={TermsAndConditions}
                options={{ title: "TermsAndConditions" }}
              />
              <Stack.Screen
                name="Privacy"
                component={PrivacyPolicyScreen}
                options={{ title: "PrivacyPolicyScreen" }}
              />
              <Stack.Screen
                name="Contact"
                component={ContactUsScreen}
                options={{ title: "ContactUsScreen" }}
              />
              <Stack.Screen name="Camera" component={CameraScreen} />
              <Stack.Screen name="MyWork" component={MyWorkScreen} />
              <Stack.Screen
                name="Notifications"
                component={NotificationScreen}
              />
            </Stack.Navigator>
          </StripeProvider>
        </ImagesProvider>
      </NavigationContainer>
      {/* </NotificationProvider> */}
    </PushTokenProvider>
  );
}
