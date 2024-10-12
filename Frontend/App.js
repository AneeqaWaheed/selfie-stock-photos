import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './assets/Component/Login';  // Update with the path to your LoginScreen
import SignupScreen from './assets/Component/SignUp';  // Update with the path to your SignupScreen
import AllImagesScreen from './assets/Component/AllImagesScreen';
import ImageDetailScreen from './assets/Component/ImageDetails';
import CameraScreen from './assets/Component/Camera';
import MyWorkScreen from './assets/Component/MyWork';

import Homelist from './assets/Component/Homelist';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
          name="Homelist" 
          component={Homelist} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AllImages" 
          component={AllImagesScreen} 
          options={{ title: 'All Images' }} // Screen title for "All Images"
        />
        <Stack.Screen name="ImageDetails" component={ImageDetailScreen} options={{ title: 'Image Details' }} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="MyWork" component={MyWorkScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
