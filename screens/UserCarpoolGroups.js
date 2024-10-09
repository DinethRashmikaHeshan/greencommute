import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, TextInput, Modal, StyleSheet, Switch } from 'react-native';
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
  const [scheduleTime, setScheduleTime] = useState([]);

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

    // Fetch members for each carpool concurrently
    const carpoolsWithMembers = await Promise.all(carpoolsData.map(async (carpool) => {
      const { data: membersData, error: membersError } = await supabase
        .from('CarpoolMembers')
        .select('member_username')
        .eq('carpool_id', carpool.id);

      if (membersError) {
        console.error('Error fetching members:', membersError);
        return { ...carpool, members: [] }; // Return carpool with empty members on error
      }

      return { ...carpool, members: membersData }; // Combine carpool data with members
    }));

    setCarpools(carpoolsWithMembers); // Update state with carpools and members
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

  return (
    <View style={tw`flex-1 p-5 `}>
      <Text style={tw`text-2xl font-bold mb-4 text-center`}>Your Carpools</Text>

      <FlatList
        data={carpools}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={tw`bg-white p-4 rounded-lg mb-2`}>
            <Text style={[tw`text-lg font-bold mb-1`,{ color: '#003B36' }]}>{item.group_name}</Text>
            <Text style={tw`text-gray-700`}>Available Seats: {item.seats}</Text>
            <Text style={tw`text-gray-700`}>Private Group: {item.is_private ? 'Yes' : 'No'}</Text>
            <Text style={tw`text-gray-700`}>Origin: {item.origin}</Text>
            <Text style={tw`text-gray-700`}>Destination: {item.destination}</Text>
            <Text style={tw`text-gray-700`}>Scheduled Time: {new Date(item.schedule_time).toLocaleString()}</Text>
            
            {/* Show Members of the Carpool */}
            <Text style={tw`text-gray-700 font-semibold mt-2`}>Members:</Text>
            <FlatList
              data={item.members} // Use members directly from the carpool data
              keyExtractor={(member) => member.member_username}
              renderItem={({ item }) => (
                <Text style={tw`text-gray-600 ml-4`}>{item.member_username}</Text>
              )}
            />

            <View style={tw`flex-row justify-between mt-4`}>
              <Button title="Update" onPress={() => openUpdateModal(item)} color="#009688" />
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
          </View>
        )}
      />

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
            <Button title="Update Carpool" onPress={handleUpdateCarpool} color="#4A90E2" />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default UserCarpoolGroups;
