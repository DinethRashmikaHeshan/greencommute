import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Optional: For adding icons

const bgImage = require('../../assets/background-image.jpeg'); // Optional: Background image

const Review = ({ route }) => {
  const [reviews, setReviews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState('5');
  const [newCarpoolName, setNewCarpoolName] = useState('');
  const [updateReviewID, setUpdateReviewID] = useState(null);

  const navigation = useNavigation();
  const { username } = route.params;
  const currentUser = username;

  const addReview = async () => {
    navigation.navigate('CRating', { username });
  };

  const deleteReview = async (reviewID) => {
    const { error } = await supabase.from('Review').delete().eq('id', reviewID);
    if (error) {
      console.error('Error deleting review:', error);
      Alert.alert('Error', 'There was an issue deleting the review.');
      return;
    }
    setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewID));
    Alert.alert('Success', 'Review deleted successfully.');
  };

  const updateReview = async () => {
    if (!newReviewText.trim() || !newReviewRating.trim()) {
      Alert.alert('Validation Error', 'Please enter both review text and rating.');
      return;
    }

    const ratingNumber = parseInt(newReviewRating, 10);
    if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      Alert.alert('Validation Error', 'Rating must be a number between 1 and 5.');
      return;
    }

    const { error } = await supabase
      .from('Review')
      .update({ reviewText: newReviewText, rating: ratingNumber })
      .eq('id', updateReviewID);

    if (error) {
      console.error('Error updating review:', error);
      Alert.alert('Error', 'There was an issue updating the review.');
      return;
    }

    await getData();
    resetForm();
    Alert.alert('Success', 'Review updated successfully.');
  };

  const resetForm = () => {
    setNewReviewText('');
    setNewCarpoolName('');
    setModalVisible(false);
    setUpdateReviewID(null);
  };

  const handleUpdate = (reviewID) => {
    const reviewToUpdate = reviews.find(review => review.id === reviewID);
    if (reviewToUpdate) {
      setNewReviewText(reviewToUpdate.reviewText);
      setNewCarpoolName(reviewToUpdate.carpoolName);
      setNewReviewRating(String(reviewToUpdate.rating));
      setUpdateReviewID(reviewID);
      setModalVisible(true);
    }
  };

  const getData = async () => {
    const { data, error } = await supabase.from('Review').select('*');
    if (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('Error', 'There was an issue fetching the reviews.');
      return;
    }
    setReviews(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  return (
    <ImageBackground
      source={bgImage} // Optional: Add a background image
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.header}>
        <Text style={styles.title}>User Reviews</Text>
        <TouchableOpacity style={styles.addButton} onPress={addReview}>
          <Icon name="add-circle" size={30} color="#2ecc71" />
          <Text style={styles.addButtonText}>Add Review</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.userID}</Text>
              <Text style={styles.carpoolName}>{review.carpoolName}</Text>
            </View>
            <Text style={styles.reviewText}>{review.reviewText}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="#f1c40f" />
              <Text style={styles.ratingText}>{review.rating}</Text>
            </View>
            {review.userID === currentUser && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => handleUpdate(review.id)}
                >
                  <Icon name="edit" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteReview(review.id)}
                >
                  <Icon name="delete" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Modal for Creating/Updating Review */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {updateReviewID ? 'Update Review' : 'Create a Review'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Carpool Name"
              value={newCarpoolName}
              editable={false}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Review Text"
              value={newReviewText}
              onChangeText={setNewReviewText}
              multiline
              numberOfLines={4}
            />
            <TextInput
              style={styles.input}
              placeholder="Rating (1-5)"
              keyboardType="numeric"
              value={newReviewRating}
              onChangeText={setNewReviewRating}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={updateReviewID ? updateReview : addReview}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>
                  {updateReviewID ? 'Update' : 'Submit'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={resetForm} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Main container with background image
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    opacity: 0.2, // Adjust opacity for better readability
  },
  // Header containing title and add button
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Title styling
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  // Add Review button styling
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: '600',
  },
  // ScrollView content container
  scrollView: {
    paddingVertical: 20,
  },
  // Individual review card
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Review header containing reviewer and carpool name
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
  },
  carpoolName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
  },
  // Review text styling
  reviewText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 10,
  },
  // Rating container
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#f1c40f',
    fontWeight: 'bold',
  },
  // Action buttons container
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  // Update button styling
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2980b9',
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  // Delete button styling
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c0392b',
    padding: 8,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
  },
  // Modal container
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  // Modal view styling
  modalView: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // Modal title
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  // Input fields
  input: {
    width: '100%',
    height: 45,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#ecf0f1',
  },
  // Text area for review text
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  // Modal button container
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  // Submit/Update button
  modalButton: {
    flex: 1,
    backgroundColor: '#2ecc71',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginRight: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  // Cancel button
  cancelButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Review;
