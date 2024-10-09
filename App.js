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
        <NavigationContainer independent={true}>
            <SafeAreaProvider>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1}}
                    keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
                >
                <Stack.Navigator>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
