import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, Linking, TouchableOpacity, Image, Pressable } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import axios from 'axios'; // Import axios for API requests
import { FontFamily, Color, FontSize, Padding, Border } from "./globalstyles";
import arrow from "../assets/Vector.svg";

const GOOGLE_MAPS_API_KEY = 'AIzaSyAlr9ejliXP037xHQtnJ2zscbPGxczkUrM'; // Replace with your Google API key

const MapScreen = ({ route }) => {
  const [location, setLocation] = useState(null);
  const [carpoolDetails, setCarpoolDetails] = useState({
    vehicle_number: '',
    owner_name: '',
  });
  const [userDetails, setUserDetails] = useState({
    phone_number: '',
  });
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [endingTime, setEndingTime] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]); // New state to store route coordinates
  const navigation = useNavigation();
  const { start, end, userId, carpoolId } = route.params;
  const [routeDistance, setRouteDistance] = useState(0);

  useEffect(() => {
    let subscription;

    const fetchCarpoolDetails = async () => {
      const { data, error } = await supabase.from('CreateCarpool')
      .select('vehicle_id, Vehicles(*),distance')  // Use foreign key to include related vehicle data
      .eq('id', carpoolId);
      if (error) {
        console.error(error);
      } else {
        console.log(data[0].Vehicles);
        console.log(data[0]);
        setCarpoolDetails(data[0].Vehicles);
        setRouteDistance(data[0].distance)
      }
    };

    const fetchUserDetails = async () => {
      const { data, error } = await supabase.from('emergency_contacts').select('*').eq('user_id', userId).eq('is_active', true);
      console.log(true);
      if (error) {
        console.error(error);
      } else {
        console.log(data[0]);
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
          setEndingTime(endTime(estimatedTime));
          

          if (distance > 200) {
            navigation.navigate('Deviation',
              {
                distance:distance,
                userId:userId,

              }
            );
          }
        }
      );

      // Fetch the route with actual roads
      fetchRoute(start, end);
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [start, end]);

  const fetchRoute = async (start, end) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${end.latitude},${end.longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (response.data.routes.length) {
        const points = decodePolyline(response.data.routes[0].overview_polyline.points);
        setRouteCoordinates(points);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b, shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  };

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
    const speed = 50; // Assuming 50 km/h speed
    const time = (distance / 1000) / speed * 60; // in minutes
    return `${Math.round(time)} minutes`;
  };

  const endTime = (remainingMinutes) => {
    // Get the current time
    const currentTime = new Date();
  
    // Add the remaining minutes to the current time
    currentTime.setMinutes(currentTime.getMinutes() + remainingMinutes);
  
    // Extract the hours and minutes
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
  
    // Format the time in hours and minutes, ensuring leading zeros if necessary
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${formattedHours}:${formattedMinutes}`;
  };


  const shareLiveLocation = () => {
    const message = `I am currently here: https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;
    const phoneNumber = '+94'+userDetails.phone_number;
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${message}`);
  };

  const endRide = () => {
    const username = userId;
    navigation.navigate('Expense',{username,routeDistance,carpoolId})
  };
  
  const confirmEmergencyCall = () => {
    Alert.alert('Emergency', 'Are you sure you want to call the police?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL('tel:119') },
    ]);
  };

  const renderBottomSheetContent = () => (
    <View style={styles.bottomSheetContent}>
      <View>
          <Text style={styles.title}>Your ETA {endingTime}  </Text>
          </View>
          <Image style={styles.frameItem} resizeMode="cover" source="" />
          <View style={styles.frameContainer}>
          <View style={styles.frameWrapper}>
          <View style={styles.imageCircleParent}>
          <Image style={styles.imageCircleIcon} resizeMode="cover" source={require("../assets/car.png")}/>
          <View style={styles.caa5366Parent}>
          <Text style={[styles.caa5366, styles.signUpTypo]}>{carpoolDetails.vehicle_number}</Text>
          <Text style={[styles.nadunSilva, styles.caa5366Position]}>{carpoolDetails.owner_name}</Text>
          </View>
          </View>
          </View>
          <View style={styles.frameWrapper}>
            <View style={[styles.button, styles.buttonShadowBox, styles.marginBetweenButtons]}>
              <TouchableOpacity onPress={shareLiveLocation}>
                <Text style={[styles.signUp, styles.signUpTypo]}>Share Ride</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.button, styles.buttonShadowBox, styles.marginBetweenButtons]}>
              <TouchableOpacity onPress={endRide}>
                <Text style={[styles.signUp, styles.signUpTypo]}>End Ride</Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
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
        >
          <Image 
            source={require("../assets/dir.png")} 
            style={{ width: 40, height: 40 }} // Adjust the size as needed
            resizeMode="contain"
          />
        </Marker>
        )}
        <Marker coordinate={start} title="Start" />
        <Marker coordinate={end} title="End" />
        <Polyline coordinates={routeCoordinates} strokeColor="#000" strokeWidth={3} />
      </MapView>

      <TouchableOpacity style={styles.emergencyButton} onPress={confirmEmergencyCall}>
        <Image style={styles.imageSirenIcon} resizeMode="cover" source={require("../assets/siren-light.png")}/>
      </TouchableOpacity>


      <View style={styles.bottomSheetContainer}>
        {renderBottomSheetContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  marginBetweenButtons: {
    marginHorizontal: 5, // You can adjust this value to change the gap
  },

  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 10,
  },
  bottomSheetContent: {
    padding: 16,
  },
  carpoolSummary: {
    marginBottom: 20,
  },
  vehicleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ownerText: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  emergencyButton: {
    position: 'absolute',
    top: 40,
    right: 10,
    padding: 10,
    borderRadius: 30,
  },
  emergencyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  buttonShadowBox: {
    shadowOpacity: 1,
    shadowOffset: {
    width: 0,
    height: -4
    }
    },
    signUpTypo: {
    fontFamily: FontFamily.buttonNormalMedium,
    fontWeight: "500"
    },
    caa5366Position: {
    position: "absolute",
    textAlign: "left"
    },
    frameChild: {
    borderStyle: "solid",
    borderColor: Color.colorGray,
    borderTopWidth: 3,
    width: 50,
    height: 3
    },
    lineWrapper: {
    alignItems: "center",
    alignSelf: "stretch"
    },
    title: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.neutralGray1,
    display: "flex",
    width: 241,
    textAlign: "left",
    alignItems: "center"
    },
    frameItem: {
    width: 20,
    height: 12
    },
    frameGroup: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch"
    },
    imageCircleIcon: {
    width: 87,
    height: 87
    },
    imageSirenIcon: {
      width: 40,
      height: 40
      },
    caa5366: {
    top: 0,
    left: 0,
    fontSize: 32,
    color: "#000",
    position: "absolute",
    textAlign: "left"
    },
    nadunSilva: {
    top: 37,
    left: 22,
    fontSize: 20,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorGray
    },
    caa5366Parent: {
    width: 169,
    height: 67
    },
    imageCircleParent: {
    gap: 20,
    flexDirection: "row",
    alignItems: "center"
    },
    frameWrapper: {
      flexDirection: "row",
      justifyContent: "center", // Center the button
      alignSelf: "stretch",
    },
    signUp: {
    fontSize: FontSize.buttonNormalMedium_size,
    lineHeight: 24,
    color: Color.neutralWhite,
    textAlign: "center",
    width: 115
    },
    button: {
      shadowColor: "rgba(236, 95, 95, 0.25)",
      shadowRadius: 14,
      elevation: 14,
      borderRadius: 50,
      backgroundColor: '#003B36',
      justifyContent: "center",
      paddingHorizontal: 15,
      paddingVertical: Padding.p_3xs,
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center", // Center the button itself
    },
    frameContainer: {
    paddingBottom: Padding.p_3xs,
    gap: 25,
    alignSelf: "stretch"
    },
    frameParent: {
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowRadius: 18,
    elevation: 18,
    borderTopLeftRadius: Border.br_3xs,
    borderTopRightRadius: Border.br_3xs,
    backgroundColor: Color.neutralWhite,
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 17,
    gap: 15
    },
});

export default MapScreen;
