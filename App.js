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

const Stack = createNativeStackNavigator();
import 'react-native-get-random-values';
import react from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { store } from './store';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Provider } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import CreateCarPool from './screens/CreateCarPool';
import UserCarpoolGroups from './screens/UserCarpoolGroups';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DashboardScreen from './screens/DashboardScreen';
import JoinedCarpoolGroups from './screens/JoinedCarpoolGroups'; 
import UserVehicles from './screens/UserVehicles'; // Import the new component




export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
        <NavigationContainer initialRouteName="SignUp">
            <SafeAreaProvider>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1}}
                    keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
                >
                <Stack.Navigator>

                  {/*signup and login*/}
                  <Stack.Screen name="SignUp" component={SignUp} />
                    <Stack.Screen name="Login" component={Login} />

                    <Stack.Screen 
                        name='HomeScreen' 
                        component={HomeScreen} 
                        options={{
                            headerShown: false,
                        }} 
                    />
                    <Stack.Screen 
                        name='CreateCarPool' 
                        component={CreateCarPool} 
                        options={{
                            headerShown: false,
                        }} 
                    />
                    <Stack.Screen 
                                name='Dashboard' 
                                component={DashboardScreen} 
                                options={{
                                    headerShown: false,
                                }} 
                            />
                    <Stack.Screen 
                        name='UserCarpoolGroups' 
                        component={UserCarpoolGroups} 
                        options={{
                            headerShown: false,
                        }} 
                    />
                    <Stack.Screen 
                        name='JoinedCarpoolGroups'  // Add this line
                        component={JoinedCarpoolGroups} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name='UserVehicles' 
                        component={UserVehicles} 
                        options={{
                            headerShown: false,
                        }} 
                    />

                    <Stack.Screen name="RouteSelection" component={RouteSelectionScreen} />
                    <Stack.Screen name="Map" component={MapScreen} />
                    <Stack.Screen name="Deviation" component={DeviationScreen} />

                    {/*Rating*/}
                    <Stack.Screen name="CRating" component={CreateReview} />
                    <Stack.Screen name="Rating" component={Review} />
                    <Stack.Screen name="Test" component={ConnectivityTest} />

                    
                </Stack.Navigator>
                </KeyboardAvoidingView>

            </SafeAreaProvider>
        </NavigationContainer>
    </Provider>
  );
}
