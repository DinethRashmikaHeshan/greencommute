// CreateReview.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Rating } from 'react-native-ratings';
import { supabase } from '../../lib/supabase'

const CreateReview = () => {
  const [carpoolName, setCarpoolName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  // Dummy data for carpool names
  const carpoolOptions = [
    { label: 'Carpool A', value: 'Carpool A' },
    { label: 'Carpool B', value: 'Carpool B' },
    { label: 'Carpool C', value: 'Carpool C' },
  ];
  const userID = "USER002"

  // Handle form submission
  const handleSubmit = async () => {
    if (!carpoolName || !reviewText || rating === 0) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Insert data into the Review table
      const { data, error } = await supabase
        .from('Review')
        .insert([
          {
            carpoolName,
            reviewText,
            rating,
            userID
          },
        ]);

      if (error) {
        throw error;
      }

      console.log('Review Submitted:', data);
      Alert.alert('Success', 'Your review has been submitted.');

      // Reset the form after submission
      setCarpoolName('');
      setReviewText('');
      setRating(0);
    } catch (error) {
      console.error('Error inserting review:', error);
      Alert.alert('Error', 'There was a problem submitting your review.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Review</Text>

      <Text style={styles.label}>Select Carpool:</Text>
      <RNPickerSelect
        onValueChange={(value) => setCarpoolName(value)}
        items={carpoolOptions}
        style={pickerSelectStyles}
        placeholder={{ label: 'Choose a carpool...', value: null }} // Placeholder
      />

      <Text style={styles.label}>Your Review:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Write your review here..."
        value={reviewText}
        onChangeText={setReviewText}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Rate the Carpool:</Text>
      <Rating
        startingValue={rating}
        imageSize={30}
        onFinishRating={setRating}
        style={styles.rating}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Post Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e9f5ee', // Light green background for eco-friendly feel
    flex: 1,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50', // Darker text for title
    marginTop: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
    color: '#34495e', // Dark text for labels
  },
  textArea: {
    height: 100,
    borderColor: '#4CAF50', // Green border
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff', // White background for text area
    borderRadius: 10,
    padding: 10,
  },
  rating: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50', // Green button
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff', // White text for button
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// Custom styles for the picker select
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#4CAF50', // Green border
    borderRadius: 10,
    color: 'black', // Black text
    marginBottom: 15,
    backgroundColor: '#ffffff', // White background
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#4CAF50', // Green border
    borderRadius: 10,
    color: 'black', // Black text
    marginBottom: 15,
    backgroundColor: '#ffffff', // White background
  },
});

export default CreateReview;
