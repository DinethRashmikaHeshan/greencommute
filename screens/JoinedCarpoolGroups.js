import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, TouchableOpacity,SafeAreaView } from 'react-native';
import { supabase } from '../lib/supabase';
import tw from 'tailwind-react-native-classnames';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const GOOGLE_GEOCODING_API_KEY = 'AIzaSyAlr9ejliXP037xHQtnJ2zscbPGxczkUrM';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { color } from 'react-native-elements/dist/helpers';

const JoinedCarpoolGroups = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params; // Assuming you are passing the username as a parameter
  const [joinedCarpools, setJoinedCarpools] = useState([]);
  const [starts, setStarts] = useState(null);
  const [ends, setEnds] = useState(null);

  useEffect(() => {
    fetchJoinedCarpools();
  }, []);

  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_GEOCODING_API_KEY}`
      );
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    } catch (error) {
      console.error('Error fetching location coordinates:', error);
      return null;
    }
  };

  const fetchJoinedCarpools = async () => {
    const { data, error } = await supabase
      .from('CarpoolMembers')
      .select('carpool_id, CreateCarpool(*)')
      .eq('member_username', username); // Fetching carpool groups that the user has joined

    if (error) {
      console.error('Error fetching joined carpools:', error);
      return;
    }

    setJoinedCarpools(data);
  };

  const handleLeaveCarpool = async (carpoolId) => {
    // Fetch the current number of seats from the CreateCarpool table
    const { data: carpoolData, error: fetchError } = await supabase
      .from('CreateCarpool')
      .select('seats')
      .eq('id', carpoolId)
      .single();
  
    if (fetchError) {
      console.error('Error fetching carpool data:', fetchError);
      Alert.alert('Error', 'Failed to fetch carpool data.');
      return;
    }
  
    const currentSeats = carpoolData.seats;
    const newSeats = currentSeats + 1;
  
    const { error: updateError } = await supabase
      .from('CreateCarpool')
      .update({ seats: newSeats })
      .eq('id', carpoolId);
  
    if (updateError) {
      console.error('Error updating carpool seats:', updateError);
      Alert.alert('Error', 'Failed to update carpool seats.');
      return;
    }
  
    const { error } = await supabase
      .from('CarpoolMembers')
      .delete()
      .eq('carpool_id', carpoolId)
      .eq('member_username', username); // User leaving the carpool group
  
    if (error) {
      console.error('Error leaving carpool:', error);
      Alert.alert('Error', 'Failed to leave the carpool group.');
      return;
    }
  
    fetchJoinedCarpools(); // Refresh the list of joined carpools
    Alert.alert('Success', 'You have left the carpool group successfully!');
  };

  const handleJoinRide =  async (carpoolId,s,e) => {
    Alert.alert('Ride Started', 'You have joined the ride successfully!');
    const [startCoords, endCoords] = await Promise.all([
      getCoordinates(s),
      getCoordinates(e)
    ]);
    const userId = username;
    console.log(s,e)
    if (startCoords && endCoords) {
      setStarts(startCoords);
      setEnds(endCoords);
    } else {
      Alert.alert('Error', 'Unable to fetch coordinates for the provided locations.');
    }
    console.log(starts,ends)
    const start = {
      latitude: starts.latitude,
      longitude: starts.longitude,
    };

    const end = {
      latitude: ends.latitude,
      longitude: ends.longitude,
    };
    console.log(start,end)
    navigation.navigate('Map', { start,end,userId,carpoolId });

    // Add any additional logic if needed for joining the ride
  };

  return (
    <SafeAreaView style={tw`flex-1`}>

    
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      <Text style={[tw`text-2xl font-bold mb-4 text-center text-green-700`,{ color: '#003B36' }]}>
        Joined Carpools
      </Text>

      <FlatList
        data={joinedCarpools}
        keyExtractor={(item) => item.carpool_id.toString()}
        renderItem={({ item }) => (
          <View style={tw`bg-white p-4 rounded-lg mb-3 shadow-lg`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Text style={[tw`ml-2 text-lg font-bold `,{ color: '#003B36' }]}>
                {item.CreateCarpool.group_name}
              </Text>
            </View>
            <Text style={tw`text-gray-700 mb-1`}>
              <FontAwesome name="users" size={16} color="gray" /> Available Seats: {item.CreateCarpool.seats}
            </Text>
            <Text style={tw`text-gray-700 mb-1`}>
              <FontAwesome name="lock" size={16} color={item.CreateCarpool.is_private ? 'red' : 'green'} /> Private Group: {item.CreateCarpool.is_private ? 'Yes' : 'No'}
            </Text>
            <Text style={tw`text-gray-700 mb-1`}>
              <MaterialIcons name="location-on" size={16} color="gray" /> Origin: {item.CreateCarpool.origin}
            </Text>
            <Text style={tw`text-gray-700 mb-1`}>
              <MaterialIcons name="location-on" size={16} color="gray" /> Destination: {item.CreateCarpool.destination}
            </Text>
            <Text style={tw`text-gray-700 mb-1`}>
              <MaterialIcons name="schedule" size={16} color="gray" /> Scheduled Time: {new Date(item.CreateCarpool.schedule_time).toLocaleString()}
            </Text>

            {item.CreateCarpool.isStart && (
              <TouchableOpacity
                style={[tw`mt-3 p-3 rounded-lg`, { backgroundColor: '#009688' }]}
                onPress={() => handleJoinRide(item.carpool_id,item.CreateCarpool.origin,item.CreateCarpool.destination)}
              >
                <Text style={tw`text-white text-center font-bold`}>
                  <FontAwesome name="car" size={16} color="white" /> Join Ride
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={tw`mt-3 bg-red-500 p-3 rounded-lg`}
              onPress={() => {
                Alert.alert(
                  'Confirm Leaving',
                  'Are you sure you want to leave this carpool group?',
                  [
                    { text: 'Cancel' },
                    { text: 'OK', onPress: () => handleLeaveCarpool(item.carpool_id) },
                  ]
                );
              }}
            >
              <Text style={tw`text-white text-center font-bold`}>
                <FontAwesome name="sign-out" size={16} color="white" /> Leave Carpool
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
    </SafeAreaView>
  );
};

export default JoinedCarpoolGroups;
