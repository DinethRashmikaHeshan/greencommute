// screens/MapScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { useNavigation } from '@react-navigation/native';

const MapScreen = ({ route }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);
  const navigation = useNavigation();

  const { start, end } = route.params;

  useEffect(() => {
    let subscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update every meter
        },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          setLocation(loc);

          const minDistance = calculateMinDistance(
            { latitude, longitude },
            [start, end]
          );

          if (minDistance > 1000) {
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
        {markers.length > 0 && (
          <>
            <Marker coordinate={start} title="Start" />
            <Marker coordinate={end} title="End" />
            <Polyline
              coordinates={[start, end]}
              strokeColor="#000"
              strokeWidth={3}
            />
            {location && (
              <Marker
                coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
                title="Current Location"
                pinColor="blue"
              />
            )}
          </>
        )}
      </MapView>
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
});

export default MapScreen;
