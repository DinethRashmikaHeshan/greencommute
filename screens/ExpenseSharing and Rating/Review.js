import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Review = ({ route }) => {
  const [reviews, setReviews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
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
      return;
    }
    setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewID));
    Alert.alert('Success', 'Review deleted successfully.');
  };

  const updateReview = async () => {
    const { error } = await supabase.from('Review').update({ reviewText: newReviewText, rating: newReviewRating }).eq('id', updateReviewID);
    if (error) {
      console.error('Error updating review:', error);
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
      setUpdateReviewID(reviewID);
      setModalVisible(true);
    }
  };

  const getData = async () => {
    const { data, error } = await supabase.from('Review').select('*');
    if (error) {
      console.error('Error fetching reviews:', error);
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
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      <Button title="Create Review" onPress={() => addReview()} color="#2ecc71" style={[styles.button, styles.createReviewButton]} />
      <ScrollView>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewContainer}>
            <Text style={styles.reviewerName}>Reviewer Name: {review.userID}</Text>
            <Text style={styles.carpoolName}>Carpool Name: {review.carpoolName}</Text>
            <Text style={styles.reviewText}>{review.reviewText}</Text>
            <Text style={styles.rating}>Rating: {review.rating} ⭐</Text>
            {review.userID === currentUser ? (
              <View style={styles.buttonContainer}>
                <Button title="Update" onPress={() => handleUpdate(review.id)} color="#3e8e41" style={styles.updateButton} />
                <Button
                  title="Delete"
                  color="#c0392b"
                  onPress={() => deleteReview(review.id)}
                  style={styles.deleteButton}
                />
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{updateReviewID ? 'Update Review' : 'Create a Review'}</Text>
            <TextInput
              style={[styles.input, styles.highlightedCarpoolName]} // Highlighted style for carpool name
              placeholder="Carpool Name"
              value={newCarpoolName}
              editable={false} // Make the input read-only
            />
            <TextInput
              style={[styles.input, styles.textArea]} // Add custom styles for text area
              placeholder="Review Text"
              value={newReviewText}
              onChangeText={setNewReviewText}
              multiline // Enable multi-line input
              numberOfLines={4} // Default number of lines
            />
            <TextInput
              style={styles.input}
              placeholder="Rating (1-5)"
              keyboardType="numeric"
              value={String(newReviewRating)}
              onChangeText={(text) => setNewReviewRating(Number(text))}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={updateReviewID ? updateReview : addReview} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>{updateReviewID ? 'Update' : 'Submit'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={resetForm} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#d5f5e3', // Light green background color
  },
  // Title style for main headings
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  // General button styles
  button: {
    borderRadius: 15, // Increased border radius
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  // Create Review button styles
  createReviewButton: {
    backgroundColor: '#2ecc71',
    marginVertical: 10, // Add margin to the Create Review button
  },
  // Review container styles
  reviewContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  // Review styles
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold', // Highlight reviewer name
    color: '#003B36',
    marginBottom: 5,
  },
  carpoolName: {
    fontSize: 16,
    fontWeight: 'bold', // Highlight carpool name
    color: '#27ae60',
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 16,
    color: '#34495e',
  },
  rating: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: '#3e8e41', // Matching color with light green
    width: 120, // Increase width of the Update button
    borderRadius: 15, // Increased border radius
  },
  deleteButton: {
    backgroundColor: '#c0392b', // Matching color with light green
    width: 120, // Increase width of the Delete button
    borderRadius: 15, // Increased border radius
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 15, // Increased border radius
    padding: 20,
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
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#34495e',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 10, // Increased border radius
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  highlightedCarpoolName: {
    color: '#27ae60', // Highlight color for carpool name
    fontWeight: 'bold', // Make the carpool name bold
    borderColor: '#2ecc71', // Different border color for carpool name input
    borderWidth: 1,
  },
  textArea: {
    height: 100, // Increased height for multi-line text input
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#2ecc71', // Button background color
    borderRadius: 15, // Increased border radius
    padding: 12, // Add padding to buttons
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#FF5733', // Cancel button color
    borderRadius: 15, // Increased border radius
    padding: 12, // Add padding to buttons
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Review;
