import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DeviationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>You have deviated from the route!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffdddd',
  },
  text: {
    fontSize: 20,
    color: '#ff0000',
  },
});

export default DeviationScreen;
