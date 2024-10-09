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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
        <NavigationContainer independent={true} initialRouteName="SignUp">
            <SafeAreaProvider>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1}}
                    keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
                >
                <Stack.Navigator>

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
                </Stack.Navigator>
                </KeyboardAvoidingView>

            </SafeAreaProvider>
        </NavigationContainer>
    </Provider>
  );
}
