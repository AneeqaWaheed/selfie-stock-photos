import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  ImageBackground,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
  Alert,
  StyleSheet,  // Add StyleSheet import here
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);

  // Fetch images from the API
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://192.168.100.186:5000/api/all-images');
      console.log('Fetched Images:', response.data);

      const filteredImages = response.data.filter(image => image.filePath);
      setImages(filteredImages.slice(0, 7)); // Limit to 7 images
    } catch (error) {
      console.error('Error fetching images:', error);
      Alert.alert('Error fetching images');
    }
  };

  // Fetch uploader profile by image ID
  const fetchImageProfile = async (imageId) => {
    try {
      const response = await axios.get(`http://192.168.100.186:5000/api/image-profile/${imageId}`);
      console.log('Fetched Profile:', response.data);
      return response.data; // Return the profile data
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error fetching profile');
      return null; // Return null if there's an error
    }
  };

  useEffect(() => {
    fetchImages(); // Fetch images when the component mounts
  }, []);

  const handleImagePress = async (image) => {
    const profile = await fetchImageProfile(image._id); // Fetch uploader's profile
    if (profile) {
      navigation.navigate('ImageDetails', {
        image: image,      // Pass image details
        uploader: profile, // Pass uploader profile details
      });
    }
  };

  return (
    <>
      <StatusBar hidden={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImageBackground source={require('../../assets/Images/Homeheader.png')} style={styles.waveImage}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/Images/logoimg.png')} style={styles.logoImage} />
          </View>
        </ImageBackground>

        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText}>{"< BACK"}</Text>
          </TouchableOpacity>

          <View style={styles.searchInputContainer}>
            <Image source={require('../../assets/Images/search.png')} style={styles.searchIcon} />
            <TextInput placeholder="beautiful woman|" placeholderTextColor="#FFFFFF" style={styles.searchInput} textAlign="center" />
            <TouchableOpacity style={styles.dropdownButton}>
              <Image source={require('../../assets/Images/dropdown.png')} style={styles.dropdownIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.viewOptionsContainer}>
          <Text style={styles.viewText}>VIEW</Text>
          <TouchableOpacity style={styles.viewOption}>
            <Image source={require('../../assets/Images/grid.png')} style={styles.viewIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewOption}>
            <Image source={require('../../assets/Images/list.png')} style={styles.viewIcon} />
          </TouchableOpacity>
        </View>

        {/* Image List */}
        <FlatList
          data={images}
          renderItem={({ item }) => (
            item.filePath ? (
              <TouchableOpacity
                onPress={() => handleImagePress(item)} // Call function to fetch profile and navigate
              >
                <View style={styles.imageItem}>
                  <Image source={{ uri: item.filePath }} style={styles.image} resizeMode="cover" />
                </View>
              </TouchableOpacity>
            ) : null
          )}
          keyExtractor={(item) => item._id}
          horizontal={false}
          numColumns={2}
          contentContainerStyle={styles.imageListContainer}
        />

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AllImages')}>
          <Text style={styles.seeMoreText}>SEE MORE</Text>
        </TouchableOpacity>
      </ScrollView>

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
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 100,
    backgroundColor: '#C4CCE7',
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
    paddingHorizontal: 10,
    width: '90%',
    justifyContent: 'space-between',
    height: 100,
    left: -55
  },
  backButton: {
    marginRight: 10,
    top: -45,
    left: 65,
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
    width: 370,
    height: 60,
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginRight: 7,
    resizeMode: 'contain',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 22,
    top:2,
    fontWeight:'bold'
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
  },
  viewText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: '-90%',
    fontWeight: 'bold',
    top: -20
  },
  viewOption: {
    marginHorizontal: 2,
  },
  imageListContainer: {
    marginTop: 35,
    paddingBottom: 100,
  },
  imageItem: {
    marginBottom: 15,
    alignItems: 'center',
    width: 170,
    marginHorizontal: 20,
  },
  image: {
    height: 170,
    borderRadius: 10,
    width: '100%',
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
    fontSize: 10,
  },
  viewIcon:{
    height:30,
    width:30,
    left:330,
    top:10
  }
});

export default HomeScreen;
