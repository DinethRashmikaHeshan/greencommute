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

//signup and login
import SignUp from './screens/Signup and Login/Signup';
import Login from './screens/Signup and Login/Login';

//expense calculator

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp">
        <Stack.Screen name="RouteSelection" component={RouteSelectionScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Deviation" component={DeviationScreen} />

        {/*Rating*/}
        <Stack.Screen name="CRating" component={CreateReview} />
        <Stack.Screen name="Rating" component={Review} />
        <Stack.Screen name="Test" component={ConnectivityTest} />

        {/*signup and login*/}
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />

        {/* expense calculator */}
        <Stack.Screen name="Login" component={Login} />

        

      </Stack.Navigator>
    </NavigationContainer>
  );
}
