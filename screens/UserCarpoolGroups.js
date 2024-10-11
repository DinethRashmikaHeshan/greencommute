import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, TextInput, Modal, StyleSheet, Switch, Linking } from 'react-native';
import { supabase } from '../lib/supabase';
import tw from 'tailwind-react-native-classnames';
import { useRoute } from '@react-navigation/native';

const UserCarpoolGroups = () => {
  const route = useRoute();
  const { username } = route.params;
  const [carpools, setCarpools] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCarpool, setSelectedCarpool] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [seats, setSeats] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  useEffect(() => {
    fetchCarpools();
  }, []);

  const fetchCarpools = async () => {
    const { data: carpoolsData, error: carpoolsError } = await supabase
      .from('CreateCarpool')
      .select('*')
      .eq('owner', username); // Fetch all fields for carpools

    if (carpoolsError) {
      console.error('Error fetching carpools:', carpoolsError);
      return;
    }

    // Update state with carpools
    setCarpools(carpoolsData); 
  };

  const handleUpdateCarpool = async () => {
    if (!groupName || !seats || !origin || !destination || !scheduleTime) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const { error } = await supabase
      .from('CreateCarpool')
      .update({ group_name: groupName, seats: seats, is_private: isPrivate, origin, destination, schedule_time: scheduleTime })
      .eq('id', selectedCarpool.id); // Update the selected carpool group

    if (error) {
      console.error('Error updating carpool:', error);
      Alert.alert('Error', 'Failed to update carpool group.');
      return;
    }

    setModalVisible(false);
    fetchCarpools();
    Alert.alert('Success', 'Carpool group updated successfully!');
  };

  const handleDeleteCarpool = async (id) => {
    const { error } = await supabase
      .from('CreateCarpool')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting carpool:', error);
      Alert.alert('Error', 'Failed to delete carpool group.');
      return;
    }

    fetchCarpools();
    Alert.alert('Success', 'Carpool group deleted successfully!');
  };

  const openUpdateModal = (carpool) => {
    setSelectedCarpool(carpool);
    setGroupName(carpool.group_name);
    setSeats(carpool.seats.toString());
    setIsPrivate(carpool.is_private);
    setOrigin(carpool.origin);
    setDestination(carpool.destination);
    setScheduleTime(carpool.schedule_time);
    setModalVisible(true);
  };

  // Invite via SMS
  const inviteViaSMS = (carpool) => {
    const message = `Join our carpool group "${carpool.group_name}" from ${carpool.origin} to ${carpool.destination} at ${new Date(carpool.schedule_time).toLocaleString()}.\nYour password to join is: ${carpool.id}`;
    const phoneNumber = ''; // You can prompt user to enter phone number or leave it blank for now

    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    Linking.openURL(smsUrl).catch((err) => console.error('Error sending SMS:', err));
  };

  // Filter carpools into private and public groups
  const privateCarpools = carpools.filter(carpool => carpool.is_private);
  const publicCarpools = carpools.filter(carpool => !carpool.is_private);

  const handleToggleTrip = async (carpool) => {
    const newIsStart = !carpool.isStart; // Toggle the isStart state
  
    const { error } = await supabase
      .from('CreateCarpool')
      .update({ isStart: newIsStart }) // Set isStart to the new value
      .eq('id', carpool.id);
  
    if (error) {
      console.error('Error toggling trip state:', error);
      Alert.alert('Error', 'Failed to update the trip status.');
      return;
    }
  
    fetchCarpools(); // Refresh the carpools after the update
    Alert.alert('Success', `Trip ${newIsStart ? 'started' : 'ended'} successfully!`);
  };
  

  const renderCarpool = ({ item }) => {
    const currentDate = new Date(); // Get the current date and time
    const carpoolDate = new Date(item.schedule_time); // Parse the carpool scheduled time
  
    return (
      <View style={tw`bg-white p-4 rounded-lg mb-2`}>
        <Text style={[tw`text-lg font-bold mb-1`, { color: '#003B36' }]}>{item.group_name}</Text>
        <Text style={tw`text-gray-700`}>Available Seats: {item.seats}</Text>
        <Text style={tw`text-gray-700`}>Private Group: {item.is_private ? 'Yes' : 'No'}</Text>
        <Text style={tw`text-gray-700`}>Origin: {item.origin}</Text>
        <Text style={tw`text-gray-700`}>Destination: {item.destination}</Text>
        <Text style={tw`text-gray-700`}>Scheduled Time: {carpoolDate.toLocaleString()}</Text>
  
        <View style={tw`flex-row mt-4`}>
          <View style={tw`flex-1 mr-2`}>
            <Button title="Edit" onPress={() => openUpdateModal(item)} color="#009688" />
          </View>
          <View style={tw`flex-1 mr-2`}>
            <Button
              title="Delete"
              onPress={() => {
                Alert.alert(
                  'Confirm Deletion',
                  'Are you sure you want to delete this carpool group?',
                  [
                    { text: 'Cancel' },
                    { text: 'OK', onPress: () => handleDeleteCarpool(item.id) },
                  ]
                );
              }}
              color="#FF3B30"
            />
          </View>
          {item.is_private && (
            <View style={tw`flex-1 ml-2`}>
              <Button title="Invite" onPress={() => inviteViaSMS(item)} color="#003B36" />
            </View>
          )}
        </View>
  
        {/* Conditionally render Start Trip button if carpoolDate is <= currentDate */}
        {carpoolDate <= currentDate && (
          <Button
          title={item.isStart ? 'End Trip' : 'Start Trip'} // Change the button text
          onPress={() => handleToggleTrip(item)} // Handle toggling the trip status
          color={item.isStart ? '#FF3B30' : '#28a745'} // Change button color based on trip state
        />
        )}
      </View>
    );
  };
  
  return (
    <View style={tw`flex-1 p-5`}>
      <Text style={tw`text-2xl font-bold mb-4 text-center`}>Your Carpools</Text>

      <Text style={tw`text-xl font-semibold mt-4`}>Private Carpools</Text>
      <FlatList
        data={privateCarpools}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCarpool}
      />

      <Text style={tw`text-xl font-semibold mt-4`}>Public Carpools</Text>
      <FlatList
        data={publicCarpools}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCarpool}
      />

      {/* Modal for updating carpool */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={tw`text-lg font-bold mb-4 text-center`}>Update Carpool Group</Text>
            <TextInput
              style={tw`border border-gray-300 p-3 mb-4 rounded-lg`}
              placeholder="Group Name"
              value={groupName}
              onChangeText={setGroupName}
            />
            <TextInput
              style={tw`border border-gray-300 p-3 mb-4 rounded-lg`}
              placeholder="Available Seats"
              value={seats}
              onChangeText={setSeats}
              keyboardType="numeric"
            />
            <TextInput
              style={tw`border border-gray-300 p-3 mb-4 rounded-lg`}
              placeholder="Origin"
              value={origin}
              onChangeText={setOrigin}
            />
            <TextInput
              style={tw`border border-gray-300 p-3 mb-4 rounded-lg`}
              placeholder="Destination"
              value={destination}
              onChangeText={setDestination}
            />
            <TextInput
              style={tw`border border-gray-300 p-3 mb-4 rounded-lg`}
              placeholder="Scheduled Time"
              value={scheduleTime}
              onChangeText={setScheduleTime}
            />
            <View style={tw`flex-row items-center mb-4`}>
              <Text style={tw`mr-2`}>Private Group:</Text>
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isPrivate ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>

            <View style={tw`flex-row mb-4`}>
              <View style={tw`flex-1 mr-2`}>
                <Button title="Update Carpool" onPress={handleUpdateCarpool} color="#009688" />
              </View>
              <View style={tw`flex-1 ml-2`}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF3B30" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
});

export default UserCarpoolGroups;
