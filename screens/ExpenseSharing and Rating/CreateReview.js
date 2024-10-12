import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Rating } from 'react-native-ratings';
import { supabase } from '../../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Optional: For adding icons

const bgImage = require('../../assets/background-image.jpeg'); // Optional: Background image

const CreateReview = ({ route, navigation }) => {
  const [carpoolName, setCarpoolName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [carpoolOptions, setCarpoolOptions] = useState([]);

  const { username } = route.params;
  const userID = username;

  // Fetch carpool names from the CreateCarpool table
  useEffect(() => {
    const fetchCarpoolOptions = async () => {
      try {
        const { data, error } = await supabase.from('CreateCarpool').select('group_name');

        if (error) {
          throw error;
        }

        const formattedOptions = data.map((carpool) => ({
          label: carpool.group_name,
          value: carpool.group_name,
        }));

        setCarpoolOptions(formattedOptions);
      } catch (error) {
        console.error('Error fetching carpool options:', error);
        Alert.alert('Error', 'There was a problem fetching carpool options.');
      }
    };

    fetchCarpoolOptions();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!carpoolName || !reviewText || rating === 0) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Insert data into the Review table
      const { data, error } = await supabase.from('Review').insert([
        {
          carpoolName,
          reviewText,
          rating,
          userID,
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
      
      // Optionally navigate back or refresh the reviews list
      navigation.goBack();
    } catch (error) {
      console.error('Error inserting review:', error);
      Alert.alert('Error', 'There was a problem submitting your review.');
    }
  };

  return (
    <ImageBackground
      source={bgImage} // Optional: Add a background image
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create a Review</Text>

          <Text style={styles.label}>Select Carpool:</Text>
          <RNPickerSelect
            onValueChange={(value) => setCarpoolName(value)}
            items={carpoolOptions}
            style={pickerSelectStyles}
            placeholder={{ label: 'Choose a carpool...', value: null }}
            Icon={() => {
              return <Icon name="arrow-drop-down" size={24} color="gray" />;
            }}
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
            tintColor="#e9f5ee"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Icon name="send" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Post Review</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Main container with background image
  container: {
    flex: 1,
    backgroundColor: '#e9f5ee', // Light green background for eco-friendly feel
  },
  backgroundImage: {
    opacity: 0.1, // Adjust opacity for better readability
  },
  // ScrollView content container
  scrollView: {
    padding: 20,
    justifyContent: 'center',
  },
  // Form container
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly transparent background to highlight the form
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  // Title styling
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50', // Darker text for title
    textAlign: 'center',
  },
  // Label styling
  label: {
    marginBottom: 5,
    fontWeight: '600',
    color: '#34495e', // Dark text for labels
  },
  // Text area styling
  textArea: {
    height: 100,
    borderColor: '#4CAF50', // Green border
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff', // White background for text area
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  // Rating component styling
  rating: {
    marginBottom: 25,
    alignSelf: 'flex-start',
  },
  // Submit button styling
  button: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50', // Green button
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  // Button text styling
  buttonText: {
    color: '#ffffff', // White text for button
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  // Button icon styling
  buttonIcon: {
    marginRight: 5,
  },
});

// Custom styles for the picker select
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#4CAF50', // Green border
    borderRadius: 10,
    color: 'black', // Black text
    paddingRight: 30, // To ensure the text is never behind the icon
    marginBottom: 15,
    backgroundColor: '#ffffff', // White background
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#4CAF50', // Green border
    borderRadius: 10,
    color: 'black', // Black text
    paddingRight: 30, // To ensure the text is never behind the icon
    marginBottom: 15,
    backgroundColor: '#ffffff', // White background
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

export default CreateReview;
