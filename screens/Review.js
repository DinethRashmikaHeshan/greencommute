import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, Modal, TextInput } from 'react-native';

const Review = () => {
  const [users, setUsers] = useState([
    {
      userID: "UID001",
      username: "Nimal",
      reviews: [
        { text: "Great carpool experience!", rating: 5, id: 1, carpoolName: "Eco Carpool 1" },
        { text: "Had a pleasant journey.", rating: 4, id: 2, carpoolName: "Eco Carpool 2" },
      ],
    },
    {
      userID: "UID002",
      username: "Kamal",
      reviews: [
        { text: "Friendly driver and comfortable ride.", rating: 5, id: 3, carpoolName: "Eco Carpool 2" },
      ],
    },
    {
      userID: "UID003",
      username: "Saman",
      reviews: [
        { text: "Very punctual and reliable.", rating: 5, id: 4, carpoolName: "Eco Carpool 3" },
        { text: "The ride was too noisy.", rating: 2, id: 5, carpoolName: "Eco Carpool 3" },
      ],
    },
  ]);

  const currentUser = "UID003"; // Example of signed-in user ID (for demonstration)
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5); // Default rating
  const [newCarpoolName, setNewCarpoolName] = useState('');

  const addReview = () => {
    const newReview = {
      text: newReviewText,
      rating: newReviewRating,
      id: Math.random().toString(), // Generate a unique ID
      carpoolName: newCarpoolName,
    };

    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.userID === currentUser) {
          return {
            ...user,
            reviews: [...user.reviews, newReview],
          };
        }
        return user;
      })
    );

    // Reset input fields and close modal
    setNewReviewText('');
    setNewCarpoolName('');
    setModalVisible(false);
    Alert.alert('Success', 'Review added successfully.');
  };

  const deleteReview = (userID, reviewID) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.userID === userID) {
          return {
            ...user,
            reviews: user.reviews.filter((review) => review.id !== reviewID),
          };
        }
        return user;
      })
    );
    Alert.alert('Success', 'Review deleted successfully.');
  };

  const updateReview = (userID, reviewID, newText) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.userID === userID) {
          return {
            ...user,
            reviews: user.reviews.map((review) =>
              review.id === reviewID ? { ...review, text: newText } : review
            ),
          };
        }
        return user;
      })
    );
    Alert.alert('Success', 'Review updated successfully.');
  };

  const handleUpdate = (userID, reviewID) => {
    const reviewToUpdate = users
      .flatMap((user) => user.reviews)
      .find((review) => review.id === reviewID);

    if (reviewToUpdate) {
      Alert.prompt(
        'Update Review',
        'Enter new review text:',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: (text) => updateReview(userID, reviewID, text),
          },
        ],
        'plain-text',
        reviewToUpdate.text // Set the current review text as the default value
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      <Button title="Create Review" onPress={() => setModalVisible(true)} />
      <ScrollView>
        {users.map((user) => (
          <View key={user.userID} style={styles.userContainer}>
            <Text style={styles.username}>{user.username}</Text>
            {user.reviews.map((review) => (
              <View key={review.id} style={styles.reviewContainer}>
                <Text style={styles.carpoolName}>Carpool Name: {review.carpoolName}</Text>
                <Text style={styles.reviewText}>{review.text}</Text>
                <Text style={styles.rating}>Rating: {review.rating} ⭐</Text>
                {user.userID === currentUser ? ( // Show buttons only for the signed-in user
                  <View style={styles.buttonContainer}>
                    <Button title="Update" onPress={() => handleUpdate(user.userID, review.id)} />
                    <Button
                      title="Delete"
                      color="#FF5733" // Red color for delete button
                      onPress={() => deleteReview(user.userID, review.id)}
                    />
                  </View>
                ) : null}
              </View>
            ))}
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
  userContainer: {
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
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495e',
  },
  carpoolName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#7f8c8d',
    marginBottom: 5,
  },
  reviewContainer: {
    marginTop: 5,
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
