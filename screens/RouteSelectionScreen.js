// screens/RouteSelectionScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

const RouteSelectionScreen = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
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
      alert('Please select both start and end points.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {start && <Marker coordinate={start} title="Start" pinColor="green" />}
        {end && <Marker coordinate={end} title="End" pinColor="red" />}
      </MapView>
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
});

export default RouteSelectionScreen;
