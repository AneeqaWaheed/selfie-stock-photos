import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View, Image, StyleSheet } from 'react-native';

const WaveContainer = () => {
  return (
    <View style={styles.container}>
      {/* SVG Wave */}
      <Svg
        viewBox="0 0 1440 320"
        style={styles.wave}
      >
        <Path
          fill="#fff"
          d="M0,256L80,240C160,224,320,192,480,160C640,128,800,96,960,101.3C1120,107,1280,149,1360,170.7L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        />
      </Svg>

      {/* Cascading Images */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/Images/sample2.jpeg')} // First image
          style={[styles.image, styles.firstImage]}
        />
        <Image
          source={require('../../assets/Images/sample2.jpeg')} // Second image
          style={[styles.image, styles.secondImage]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300, // Adjust height as per design
    backgroundColor: '#C4CCE7', // Wave background color
    position: 'relative',
  },
  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    position: 'absolute', // Images are positioned relative to the wave
    top: 100, // Adjust the top position to control where the images start
    left: 0,
    right: 0,
    alignItems: 'center', // Center the images horizontally
  },
  image: {
    width: 200, // Width of images (adjust based on your design)
    height: 200, // Height of images (adjust based on your design)
    borderRadius: 100, // Circular images
    position: 'absolute',
  },
  firstImage: {
    top: -70, // Move the first image higher
    zIndex: 2, // Ensure this image is above the second one
  },
  secondImage: {
    top: 60, // Slightly below the first image
    zIndex: 1, // Behind the first image
  },
});

export default WaveContainer;
