import React from 'react';
import { StyleSheet, View, Image, ImageBackground, StatusBar, TextInput, TouchableOpacity, Text, Dimensions, ScrollView } from 'react-native';

const HomeScreen = () => {
  const { width: screenWidth } = Dimensions.get('window'); // Get device width for responsive design

  return (
    <>
      {/* Hide status bar */}
      <StatusBar hidden={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Image Background for the wave */}
        <ImageBackground
          source={require('../../assets/Images/Homeheader.png')} // Your wave image
          style={styles.waveImage}
        >
          {/* Logo container */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/Images/logoimg.png')} // Your logo image
              style={styles.logoImage}
            />
          </View>
        </ImageBackground>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText}>{"< BACK"}</Text>
          </TouchableOpacity>

          <View style={styles.searchInputContainer}>
            <Image
              source={require('../../assets/Images/search.png')} // Your search icon image
              style={styles.searchIcon}
            />

            <TextInput
              placeholder="beautiful woman|"
              placeholderTextColor="#FFFFFF"
              style={styles.searchInput}
              textAlign="center"
            />

            <TouchableOpacity style={styles.dropdownButton}>
              <Image
                source={require('../../assets/Images/dropdown.png')} // Replace with the exact dropdown icon from your image
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* View Options (Text + Icons) */}
        <View style={styles.viewOptionsContainer}>
          <Text style={styles.viewText}>VIEW</Text>
          <TouchableOpacity style={styles.viewOption}>
            <Image
              source={require('../../assets/Images/grid.png')} // Replace with the grid icon
              style={styles.viewIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewOption}>
            <Image
              source={require('../../assets/Images/list.png')} // Replace with the list icon
              style={styles.viewIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Image grid */}
        <View style={styles.imageGridContainer}>
          <View style={styles.imageRow}>
            <Image source={require('../../assets/Images/sample2.jpeg')} style={styles.image} />
            <Image source={require('../../assets/Images/sample2.jpeg')} style={styles.image} />
          </View>
          <View style={styles.imageRow}>
            <Image source={require('../../assets/Images/sample2.jpeg')} style={styles.image} />
            <Image source={require('../../assets/Images/sample2.jpeg')} style={styles.image} />
          </View>
          <View style={styles.imageRow}>
            <Image source={require('../../assets/Images/sample2.jpeg')} style={styles.image} />
            <Image source={require('../../assets/Images/sample2.jpeg')} style={styles.image} />
          </View>
        </View>
        
        {/* See More Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.seeMoreText}>SEE MORE</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../../assets/Images/search.png')} style={styles.navIcon} />
          <Text style={styles.navText}>SEARCH</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../../assets/Images/My Photos.png')} style={styles.navIcon} />
          <Text style={styles.navText}>MY WORKS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../../assets/Images/Camera.png')} style={styles.navIcon} />
          <Text style={styles.navText}>CAMERA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../../assets/Images/Notifications.png')} style={styles.navIcon} />
          <Text style={styles.navText}>NOTIFICATIONS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../../assets/Images/Account.png')} style={styles.navIcon} />
          <Text style={styles.navText}>ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#C4CCE7',
    
  },
  scrollContainer: {
    paddingBottom: 100, // Padding to prevent content from being hidden behind the bottom navigation
  },
  waveImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    paddingTop: 40,
  },
  logoImage: {
    width: 150,
    height: 150,
    top: '7%',
    resizeMode: 'contain',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 0,
    width: '90%',
    justifyContent: 'space-between',
    height: 100,
  },
  backButton: {
    marginRight: 10,
    top: -35,
    left: 12,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(158, 170, 211, 0.39)',
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 22,
    width:370,
    height: 60,
    right: '11%',
    top: '12%',
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginRight:7,
    resizeMode: 'contain',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 25,
    right: '190%',
  },
  dropdownButton: {
    paddingHorizontal: 5,
  },
  dropdownIcon: {
    width: 30,
    height: 25,
    resizeMode: 'contain',
  },
  viewOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    top: '8%',
  },
  viewText: {
    color: '#FFFFFF',
    fontSize: 20,
    marginRight: '-90%',
    top: '-10%',
    fontWeight: 'bold',
  },
  viewOption: {
    marginHorizontal: 2,
  },
  imageGridContainer: {
    marginTop: 35,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  image: {
    height: 170,
    borderRadius: 10,
    width: '40%',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginVertical: 25,
  },
  seeMoreText: {
    color: '#617FE5',
    fontSize: 16,
  },
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
    fontSize: 12,
  },
  viewIcon: {
    width: 30,
    height: 25,
    resizeMode: 'contain',
    right:-320,
    top: '-60%',
  },
});

export default HomeScreen;
