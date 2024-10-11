import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import tw from 'tailwind-react-native-classnames';
import Map from '../components/Map';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigateCard from '../components/NavigateCard';
import RideOptionCard from '../components/RideOptionCard';
import CreateCarpoolGroup from '../components/CreateCarpoolGroup';
import { Icon } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';

const CreateCarPool = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params;

  return (
    <View style={tw`flex-1`}>
      <TouchableOpacity
        onPress={() => navigation.navigate('HomeScreen')}
        style={tw`bg-gray-100 absolute top-16 left-8 z-50 p-3 rounded-full shadow-lg`}
      >
        <Icon name='menu' />
      </TouchableOpacity>

      <View style={tw`h-1/3`}>
        <Map />
      </View>

      <View style={tw`h-2/3`}>
        <Stack.Navigator
          screenOptions={{
            animation: 'slide_from_bottom', // Custom animation for the stack screens
            headerShown: false,
            gestureEnabled: true, // Enables swipe gesture to go back
            cardStyle: { backgroundColor: 'transparent' }, // Make background transparent for smooth animation
          }}
        >
          <Stack.Screen
            name='NavigateCard'
            component={NavigateCard}
            initialParams={{ username }}
          />
          <Stack.Screen
            name='RideOptionCard'
            component={RideOptionCard}
          />
          <Stack.Screen
            name='CreateCarpoolGroup'
            component={CreateCarpoolGroup}
          />
        </Stack.Navigator>
      </View>
    </View>
  );
};

export default CreateCarPool;

const styles = StyleSheet.create({});
