import React from 'react';
import { View, StyleSheet } from 'react-native';
import LocationTracker from '../components/LocationTracker';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <LocationTracker />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
