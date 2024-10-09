import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, Linking, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Icons
import { supabase } from '../lib/supabase';

const MapScreen = ({ route }) => {
  const [location, setLocation] = useState(null);
  const [carpoolDetails, setCarpoolDetails] = useState({
    VehicleNo: '',
    VehicleOwnerName: '',
  });
  const [userDetails, setUserDetails] = useState({
    emergencyContact: '',
  });
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const navigation = useNavigation();
  const { start, end } = route.params;

  useEffect(() => {
    let subscription;

    const fetchCarpoolDetails = async () => {
      const { data, error } = await supabase.from('CarPool').select('*').eq('id', 1);
      if (error) {
        console.error(error);
      } else {
        setCarpoolDetails(data[0]);
      }
    };

    const fetchUserDetails = async () => {
      const { data, error } = await supabase.from('User').select('*').eq('id', 1);
      if (error) {
        console.error(error);
      } else {
        setUserDetails(data[0]);
      }
    };

    fetchCarpoolDetails();
    fetchUserDetails();

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

          if (distance > 10000000000000) {
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

  const calculateMinDistance = (userLocation, route) => {
    let minDistance = Infinity;
    route.forEach((point) => {
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
    const speed = 50;
    const time = (distance / 1000) / speed * 60;
    return `${Math.round(time)} minutes`;
  };

  const shareLiveLocation = () => {
    const message = `I am currently here: https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;
    const phoneNumber = userDetails.emergencyContact;
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${message}`);
  };

  const confirmEmergencyCall = () => {
    Alert.alert('Emergency', 'Are you sure you want to call the police?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL('tel:119') },
    ]);
  };

  const renderBottomSheetContent = () => (
    <View style={styles.bottomSheetContent}>
      <View style={styles.carpoolSummary}>
        <Text style={styles.vehicleText}>Vehicle No: {carpoolDetails.VehicleNo}</Text>
        <Text style={styles.ownerText}>Owner: {carpoolDetails.VehicleOwnerName}</Text>
        <View style={styles.row}>
          <FontAwesome name="road" size={24} color="black" />
          <Text style={styles.detailText}>Remaining Distance: {remainingDistance} meters</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="timer" size={24} color="black" />
          <Text style={styles.detailText}>Estimated Time: {estimatedTime}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.shareButton} onPress={shareLiveLocation}>
        <FontAwesome name="share-alt" size={20} color="white" />
        <Text style={styles.shareButtonText}>Share Live Location</Text>
      </TouchableOpacity>
    </View>
  );

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
          <Marker
            coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
            title="Current Location"
            pinColor="blue"
          />
        )}
        <Marker coordinate={start} title="Start" />
        <Marker coordinate={end} title="End" />
        <Polyline coordinates={[start, end]} strokeColor="#000" strokeWidth={3} />
      </MapView>

      <TouchableOpacity style={styles.emergencyButton} onPress={confirmEmergencyCall}>
        <FontAwesome name="phone" size={20} color="white" />
        <Text style={styles.emergencyButtonText}>SOS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.bottomSheetTrigger} onPress={() => setBottomSheetVisible(true)}>
        <Text style={styles.bottomSheetTriggerText}>Carpool Details</Text>
      </TouchableOpacity>

      <Modal
        isVisible={isBottomSheetVisible}
        onBackdropPress={() => setBottomSheetVisible(false)}
        style={styles.bottomSheetModal}
      >
        {renderBottomSheetContent()}
      </Modal>
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
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  bottomSheetTrigger: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 30,
  },
  bottomSheetTriggerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomSheetModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheetContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 250,
  },
  carpoolSummary: {
    marginBottom: 20,
  },
  vehicleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ownerText: {
    fontSize: 16,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 10,
  },
  shareButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default MapScreen;
