import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import tw from 'tailwind-react-native-classnames';
import { useRoute } from '@react-navigation/native';

const JoinedCarpoolGroups = () => {
  const route = useRoute();
  const { username } = route.params; // Assuming you are passing the username as a parameter
  const [joinedCarpools, setJoinedCarpools] = useState([]);

  useEffect(() => {
    fetchJoinedCarpools();
  }, []);

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
  
    // Update the available seats
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
  
    // Now delete the user from the CarpoolMembers table
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

  const handleJoinRide = (carpoolId) => {
    Alert.alert('Ride Started', 'You have joined the ride successfully!');
    // Add any additional logic if needed for joining the ride
  };

  return (
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold mb-4 text-center`}>Joined Carpools</Text>

      <FlatList
        data={joinedCarpools}
        keyExtractor={(item) => item.carpool_id.toString()}
        renderItem={({ item }) => (
          <View style={tw`bg-white p-4 rounded-lg mb-2 shadow-lg`}>
            <Text style={tw`text-lg font-bold mb-1 text-blue-700`}>{item.CreateCarpool.group_name}</Text>
            <Text style={tw`text-gray-700`}>Available Seats: {item.CreateCarpool.seats}</Text>
            <Text style={tw`text-gray-700`}>Private Group: {item.CreateCarpool.is_private ? 'Yes' : 'No'}</Text>
            <Text style={tw`text-gray-700`}>Origin: {item.CreateCarpool.origin}</Text>
            <Text style={tw`text-gray-700`}>Destination: {item.CreateCarpool.destination}</Text>
            <Text style={tw`text-gray-700`}>Scheduled Time: {new Date(item.CreateCarpool.schedule_time).toLocaleString()}</Text>

            {/* Conditionally show Join Ride button when isStart is true */}
            {item.CreateCarpool.isStart && (
              <Button
                title="Join Ride"
                onPress={() => handleJoinRide(item.carpool_id)}
                color="#28a745" // Green color for the "Join Ride" button
              />
            )}

            <Button
              title="Leave Carpool"
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
              color="#FF3B30" // Red color for the "Leave Carpool" button
            />
          </View>
        )}
      />
    </View>
  );
};

export default JoinedCarpoolGroups;
