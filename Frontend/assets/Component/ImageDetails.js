import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import axios from 'axios';

const ImageDetailsScreen = ({ route }) => {
  const { image } = route.params; // Get the image data passed from HomeScreen
  const [uploader, setUploader] = useState(null); // State to hold uploader profile data
  const [isFollowing, setIsFollowing] = useState(false); // State for following status
  const [followerCount, setFollowerCount] = useState(0); // State for follower count
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [selectedSize, setSelectedSize] = useState(null); // State to hold the selected image size

  // Function to fetch uploader profile data
  const fetchUploaderProfile = async () => {
    try {
      const response = await axios.get(`http://192.168.100.186:5000/api/image-profile/${image._id}`); // Call your image profile API
      setUploader(response.data.profile); // Set the uploader state
      setFollowerCount(response.data.profile.followers || 0); // Set follower count from the profile
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error fetching profile data');
    }
  };

  // Function to handle follow/unfollow
  const handleFollow = async () => {
    const url = `http://192.168.100.186:5000/api/follow/${uploader.user}`; // Use uploader.user for the user ID
    try {
      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer your-jwt-token`, // Replace with the actual JWT token
        },
      });

      setIsFollowing(!isFollowing);
      setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1);
      Alert.alert(response.data.message);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      Alert.alert('Error following/unfollowing user');
    }
  };

  // Function to handle purchase button click
  const handlePurchase = (size) => {
    setSelectedSize(size); // Set the selected size
    setModalVisible(true); // Show the modal
  };

  useEffect(() => {
    fetchUploaderProfile(); // Fetch uploader profile data on component mount
  }, []);

  if (!uploader) return <Text>Loading...</Text>; // Loading state while fetching

  return (
    <View style={styles.container}>
      {/* User profile section */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: uploader.profileImage }} style={styles.profileImage} />
        <View style={styles.profileTextContainer}>
          <Text style={styles.username}>{uploader.username}</Text>
          <Text style={styles.bio}>{uploader.bio}</Text>
        </View>
        <TouchableOpacity
          style={styles.followButton}
          onPress={handleFollow}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image section */}
      <Image 
        source={{ uri: image.filePath }} 
        style={styles.image} 
        resizeMode="contain"
      />

      {/* Image size options */}
      <View style={styles.sizeOptions}>
        <TouchableOpacity onPress={() => handlePurchase('1500x1500')} style={styles.sizeButton}>
          <Text style={styles.sizeText}>1500 x 1500 - $10.00</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePurchase('3000x3000')} style={styles.sizeButton}>
          <Text style={styles.sizeText}>3000 x 3000 - $25.00</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePurchase('5000x5000')} style={styles.sizeButton}>
          <Text style={styles.sizeText}>5000 x 5000 - $50.00</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePurchase('8000x8000')} style={styles.sizeButton}>
          <Text style={styles.sizeText}>8000 x 8000 - $100.00</Text>
        </TouchableOpacity>
      </View>

      {/* Purchase Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Purchase</Text>
            <Text style={styles.modalText}>You selected {selectedSize}. Confirm your purchase?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  Alert.alert('Purchase Successful', `You purchased the ${selectedSize} image.`);
                }}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#C4CCE7',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#C4CCE7',
    borderRadius: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  followButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 450,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 20,
  },
  sizeOptions: {
    marginBottom: 20,
  },
  sizeButton: {
    backgroundColor: '#FFCC00',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  sizeText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#FFCC00',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImageDetailsScreen;
