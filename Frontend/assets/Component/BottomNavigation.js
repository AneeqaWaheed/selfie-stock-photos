// components/BottomNavigation.js
import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const BottomNavigation = () => {
  const navigation = useNavigation(); // Initialize navigation hook

  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MyWork')}>
        <Image source={require('../../assets/Images/My Photos.png')} style={styles.navIcon} />
        <Text style={styles.navText}>MY WORKS</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Camera')}>
        <Image source={require('../../assets/Images/Camera.png')} style={styles.navIcon} />
        <Text style={styles.navText}>CAMERA</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Notifications')}>
        <Image source={require('../../assets/Images/Notifications.png')} style={styles.navIcon} />
        <Text style={styles.navText}>NOTIFICATIONS</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
        <Image source={require('../../assets/Images/Account.png')} style={styles.navIcon} />
        <Text style={styles.navText}>ACCOUNT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: 'rgba(97, 127, 229, 0.9)',
    height: 70,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 25,
    height: 25,
    tintColor: '#FFFFFF',
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
});

export default BottomNavigation;
