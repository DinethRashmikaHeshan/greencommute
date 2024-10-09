// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RouteSelectionScreen from './screens/RouteSelectionScreen';
import MapScreen from './screens/MapScreen';
import DeviationScreen from './screens/DeviationScreen';
import EmergencyContactManager from './screens/emergencyContactManager';  

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RouteSelection">
        <Stack.Screen name="RouteSelection" component={RouteSelectionScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Deviation" component={DeviationScreen} />
        <Stack.Screen name="Contact" component={EmergencyContactManager} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
