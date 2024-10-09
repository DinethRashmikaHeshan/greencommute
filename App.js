// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RouteSelectionScreen from './screens/RouteSelectionScreen';
import MapScreen from './screens/MapScreen';
import DeviationScreen from './screens/DeviationScreen';

//carpool Rating
import CreateReview from './screens/ExpenseSharing and Rating/CreateReview';
import Review from './screens/ExpenseSharing and Rating/Review';
import ConnectivityTest from './screens/ExpenseSharing and Rating/ConnectivityTest';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Rating">
        <Stack.Screen name="RouteSelection" component={RouteSelectionScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Deviation" component={DeviationScreen} />
        <Stack.Screen name="CRating" component={CreateReview} />
        <Stack.Screen name="Rating" component={Review} />
        <Stack.Screen name="Test" component={ConnectivityTest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
