// screens/MapScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, Button, Linking, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { useNavigation } from '@react-navigation/native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import firebase from '@react-native-firebase/database';

const MapScreen = ({ route }) => {
  const [location, setLocation] = useState(null);
  const [carpoolDetails, setCarpoolDetails] = useState([]);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const navigation = useNavigation();
  const { start, end } = route.params;

  useEffect(() => {
    fetchCarpoolDetails();
    calculateRemainingDistance();
    
    let subscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access location was denied');
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          setLocation(loc);
          const distance = calculateMinDistance(
            { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
            [start, end]
          );

          setRemainingDistance(distance);
          setEstimatedTime(calculateEstimatedTime(distance));

          if (distance > 1000) {
            navigation.navigate('Deviation');
          }
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [start, end]);

  const fetchCarpoolDetails = () => {
    // Fetch carpool members and vehicle details from Firebase
    firebase.database().ref('/carpoolDetails').on('value', snapshot => {
      const data = snapshot.val();
      setCarpoolDetails(data);
    });

// Retrieve user data by userId
database.ref('users/' + userId).once('value').then(snapshot => {
  const userData = snapshot.val();
  console.log(userData);
});

// Retrieve carpool group data by carpoolId
database.ref('carpoolGroups/' + carpoolId).once('value').then(snapshot => {
  const carpoolData = snapshot.val();
  console.log(carpoolData);
});
  };

  const calculateMinDistance = (userLocation, route) => {
    let minDistance = Infinity;
    route.forEach(point => {
      const distance = getDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: point.latitude, longitude: point.longitude }
      );
      if (distance < minDistance) {
        minDistance = distance;
      }
    });
    return minDistance;
  };

  const calculateEstimatedTime = (distance) => {
    // A simple logic for demo, you can modify it based on your needs
    const speed = 50; // Assuming average speed of 50 km/h
    const time = (distance / 1000) / speed * 60;
    return `${Math.round(time)} minutes`;
  };

  const shareLiveLocation = () => {
    const message = `I am currently here: https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;
    const phoneNumber = carpoolDetails.vehicleOwnerPhoneNumber; // Assumes phone number is stored in Firebase

    Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${message}`);
  };

  const confirmEmergencyCall = () => {
    Alert.alert('Emergency', 'Are you sure you want to call the police?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL('tel:119') },
    ]);
  };

  const renderContent = () => (
    <View style={styles.bottomSheetContent}>
      <Text>Vehicle: {carpoolDetails.vehicleNumber}</Text>
      <Text>Owner: {carpoolDetails.vehicleOwner}</Text>
      <Text>Remaining Distance: {remainingDistance} meters</Text>
      <Text>Estimated Time: {estimatedTime}</Text>
      <Button title="Share Live Location" onPress={shareLiveLocation} />
    </View>
  );

  const sheetRef = React.createRef();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: start.latitude,
          longitude: start.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {location && (
          <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} title="Current Location" pinColor="blue" />
        )}
        <Marker coordinate={start} title="Start" />
        <Marker coordinate={end} title="End" />
        <Polyline coordinates={[start, end]} strokeColor="#000" strokeWidth={3} />
      </MapView>

      <TouchableOpacity style={styles.emergencyButton} onPress={confirmEmergencyCall}>
        <Text style={styles.emergencyButtonText}>SOS</Text>
      </TouchableOpacity>

      <BottomSheet
        ref={sheetRef}
        snapPoints={[300, 50]} // First position fully expanded, second collapsed
        borderRadius={10}
        renderContent={renderContent}
      />
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
  emergencyButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 30,
  },
  emergencyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomSheetContent: {
    backgroundColor: 'white',
    padding: 20,
    height: 300,
  },
});

export default MapScreen;
