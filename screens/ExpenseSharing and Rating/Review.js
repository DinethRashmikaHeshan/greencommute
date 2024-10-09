import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, Modal, TextInput } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Review = ({route}) => {
  const [reviews, setReviews] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newCarpoolName, setNewCarpoolName] = useState('');
  const [updateReviewID, setUpdateReviewID] = useState(null); // State to hold the review ID being updated

  const navigation = useNavigation();

  const { username } = route.params;
  const currentUser = username;

  const addReview = async () => {
    navigation.navigate('CRating', { username })
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
  
    // Fetch the latest data to refresh the reviews
    await getData(); // Refresh the screen after update
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
      setModalVisible(true); // Open the modal for updating
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

  // Use useFocusEffect to refetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      <Button title="Create Review" onPress={() => addReview()} />
      <ScrollView>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewContainer}>
            <Text style={styles.carpoolName}>Carpool Name: {review.carpoolName}</Text>
            <Text style={styles.reviewText}>{review.reviewText}</Text>
            <Text style={styles.rating}>Rating: {review.rating} ⭐</Text>
            {review.userID === currentUser ? (
              <View style={styles.buttonContainer}>
                <Button title="Update" onPress={() => handleUpdate(review.id)} />
                <Button
                  title="Delete"
                  color="#FF5733"
                  onPress={() => deleteReview(review.id)}
                />
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>

      {/* Modal for Creating or Updating a Review */}
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
              style={styles.input}
              placeholder="Carpool Name"
              value={newCarpoolName}
              editable={false} // Make the input read-only
            />
            <TextInput
              style={styles.input}
              placeholder="Review Text"
              value={newReviewText}
              onChangeText={setNewReviewText}
            />
            <TextInput
              style={styles.input}
              placeholder="Rating (1-5)"
              keyboardType="numeric"
              value={String(newReviewRating)}
              onChangeText={(text) => setNewReviewRating(Number(text))}
            />
            <Button title={updateReviewID ? "Update" : "Submit"} onPress={updateReviewID ? updateReview : addReview} />
            <Button title="Cancel" color="#FF5733" onPress={resetForm} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e9f5ee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
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
  carpoolName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#7f8c8d',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
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
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default Review;
