import React, { useState } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';

const GOOGLE_PLACES_API_KEY = 'AIzaSyAlr9ejliXP037xHQtnJ2zscbPGxczkUrM'; // Replace with your API Key

const RouteSelectionScreen = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const navigation = useNavigation();

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    if (!start) {
      setStart({ latitude, longitude });
    } else if (!end) {
      setEnd({ latitude, longitude });
    }
  };

  const handleNavigate = () => {
    if (start && end) {
      navigation.navigate('Map', { start, end });
    } else {
      Alert.alert('Error', 'Please select both start and end points.');
    }
  };

  const handleLocationSelect = (data, details, setLocation) => {
    const { lat, lng } = details.geometry.location;
    setLocation({ latitude: lat, longitude: lng });
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Enter Start Location"
        fetchDetails
        onPress={(data, details = null) => handleLocationSelect(data, details, setStart)}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        styles={{ textInput: styles.textInput }}
      />

      <GooglePlacesAutocomplete
        placeholder="Enter End Location"
        fetchDetails
        onPress={(data, details = null) => handleLocationSelect(data, details, setEnd)}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        styles={{ textInput: styles.textInput }}
      />

      <Button title="Go to Map Screen" onPress={handleNavigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  textInput: {
    height: 44,
    color: '#5d5d5d',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default RouteSelectionScreen;
