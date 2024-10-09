import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, Modal, TextInput } from 'react-native';
import { supabase } from '../../lib/supabase'; // Adjust the path as necessary
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Review = () => {
  const [reviews, setReviews] = useState([]); // Initialize with an empty array
  const currentUser = "USER002"; // Example of signed-in user ID (for demonstration)

  const [modalVisible, setModalVisible] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5); // Default rating
  const [newCarpoolName, setNewCarpoolName] = useState('');

  const navigation = useNavigation();

  const addReview = async () => {
    const newReview = {
      carpoolName: newCarpoolName,
      rating: newReviewRating,
      reviewText: newReviewText,
      userID: currentUser,
      id: Math.random().toString(), // Generate a unique ID
    };

    // Update local state
    setReviews(prevReviews => [...prevReviews, newReview]);

    // Reset input fields and close modal
    setNewReviewText('');
    setNewCarpoolName('');
    setModalVisible(false);
    Alert.alert('Success', 'Review added successfully.');

    // Insert the new review into Supabase
    const { error } = await supabase.from('Review').insert([newReview]);
    if (error) {
      console.error('Error inserting review:', error);
    }
  };

  const deleteReview = async (reviewID) => {
    // Delete from Supabase
    const { error } = await supabase.from('Review').delete().eq('id', reviewID);
    if (error) {
      console.error('Error deleting review:', error);
      return;
    }

    // Update local state
    setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewID));
    Alert.alert('Success', 'Review deleted successfully.');
  };

  const updateReview = async (reviewID, newText) => {
    // Update in Supabase
    const { error } = await supabase.from('Review').update({ reviewText: newText }).eq('id', reviewID);
    if (error) {
      console.error('Error updating review:', error);
      return;
    }

    // Update local state
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewID ? { ...review, reviewText: newText } : review
      )
    );
    Alert.alert('Success', 'Review updated successfully.');
  };

  const update = () => {
    navigation.navigate('CRating')
  }

  const handleUpdate = (reviewID) => {
    const reviewToUpdate = reviews.find(review => review.id === reviewID);

    if (reviewToUpdate) {
      Alert.prompt(
        'Update Review',
        'Enter new review text:',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'OK',
            onPress: () => update(),
          },
        ],
        'plain-text',
        reviewToUpdate.reviewText // Set the current review text as the default value
      );
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
      getData(); // Fetch reviews when component mounts or when screen comes into focus
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      <Button title="Create Review" onPress={() => update()} />
      <ScrollView>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewContainer}>
            <Text style={styles.carpoolName}>Carpool Name: {review.carpoolName}</Text>
            <Text style={styles.reviewText}>{review.reviewText}</Text>
            <Text style={styles.rating}>Rating: {review.rating} ⭐</Text>
            {review.userID === currentUser ? ( // Show buttons only for the signed-in user
              <View style={styles.buttonContainer}>
                <Button title="Update" onPress={() => handleUpdate(review.id)} />
                <Button
                  title="Delete"
                  color="#FF5733" // Red color for delete button
                  onPress={() => deleteReview(review.id)}
                />
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>

      {/* Modal for Creating a Review */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Create a Review</Text>
            <TextInput
              style={styles.input}
              placeholder="Carpool Name"
              value={newCarpoolName}
              onChangeText={setNewCarpoolName}
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
            <Button title="Submit" onPress={addReview} />
            <Button title="Cancel" color="#FF5733" onPress={() => setModalVisible(false)} />
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
