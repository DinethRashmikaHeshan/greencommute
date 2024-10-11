import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TextInput, Modal, StyleSheet, Switch, Linking, FlatList } from 'react-native';
import { supabase } from '../lib/supabase';
import { Button, Icon } from 'react-native-elements';
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
      .eq('owner', username);

    if (carpoolsError) {
      console.error('Error fetching carpools:', carpoolsError);
      return;
    }

    setCarpools(carpoolsData);
  };

  const handleUpdateCarpool = async () => {
    if (!groupName || !seats || !origin || !destination || !scheduleTime) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const { error } = await supabase
      .from('CreateCarpool')
      .update({ group_name: groupName, seats, is_private: isPrivate, origin, destination, schedule_time: scheduleTime })
      .eq('id', selectedCarpool.id);

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

  const inviteViaSMS = (carpool) => {
    const message = `Join our carpool group "${carpool.group_name}" from ${carpool.origin} to ${carpool.destination} at ${new Date(carpool.schedule_time).toLocaleString()}.\nYour password to join is: ${carpool.id}`;
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    Linking.openURL(smsUrl).catch((err) => console.error('Error sending SMS:', err));
  };

  const handleToggleTrip = async (carpool) => {
    const newIsStart = !carpool.isStart;

    const { error } = await supabase
      .from('CreateCarpool')
      .update({ isStart: newIsStart })
      .eq('id', carpool.id);

    if (error) {
      console.error('Error toggling trip state:', error);
      Alert.alert('Error', 'Failed to update the trip status.');
      return;
    }

    fetchCarpools();
    Alert.alert('Success', `Trip ${newIsStart ? 'started' : 'ended'} successfully!`);
  };

  const renderCarpool = ({ item }) => {
    const currentDate = new Date();
    const carpoolDate = new Date(item.schedule_time);

    return (
      <View style={[tw`bg-white p-4 rounded-lg mb-3`, styles.shadow]}>
        <View style={tw`flex-row justify-between`}>
          <Text style={[tw`text-lg font-bold`, { color: '#003B36' }]}>{item.group_name}</Text>
          <View style={tw`flex-row justify-between`}>
          <Button
            icon={<Icon name="edit" color="black" size={18} />}
            type="clear"
            onPress={() => openUpdateModal(item)}
          />
          <Button
            icon={<Icon name="trash" type="font-awesome" color="red" size={18} />}
            type="clear"
            onPress={() => {
              Alert.alert('Confirm', 'Are you sure you want to delete this carpool?', [
                { text: 'Cancel' },
                { text: 'OK', onPress: () => handleDeleteCarpool(item.id) },
              ]);
            }}
          />
          </View>
        </View>
        <Text style={tw`text-gray-700`}>Seats: {item.seats}</Text>
        <Text style={tw`text-gray-700`}>Private: {item.is_private ? 'Yes' : 'No'}</Text>
        <Text style={tw`text-gray-700`}>From: {item.origin}</Text>
        <Text style={tw`text-gray-700`}>To: {item.destination}</Text>
        <Text style={tw`text-gray-700`}>Time: {carpoolDate.toLocaleString()}</Text>

        <View style={tw`flex-row mt-4`}>
          
          {item.is_private && (
            <Button
              icon={<Icon name="send" type="font-awesome" color="white" size={18} />}
              buttonStyle={[styles.button, { backgroundColor: '#003B36' }]}
              title=" Invite"
              onPress={() => inviteViaSMS(item)}
            />
          )}
          {carpoolDate <= currentDate && (
            <Button
              icon={<Icon name={item.isStart ? 'stop' : 'play'} type="font-awesome" color="white" size={18} />}
              buttonStyle={[styles.button, { backgroundColor: item.isStart ? '#FF3B30' : '#009688' }]}
              title={item.isStart ? ' End Trip' : ' Start Trip'}
              onPress={() => handleToggleTrip(item)}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 p-5`}>
      <Text style={tw`text-2xl font-bold mb-4 text-center`}>Your Carpools</Text>

      <FlatList
        data={carpools}
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
            <Text style={tw`text-lg font-bold mb-4 text-center`}>Update Carpool</Text>
            <TextInput
              style={tw`border border-gray-300 p-3 mb-4 rounded-lg`}
              placeholder="Group Name"
              value={groupName}
              onChangeText={setGroupName}
            />
            <TextInput
              style={tw`border border-gray-300 p-3 mb-4 rounded-lg`}
              placeholder="Seats"
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
              <Switch value={isPrivate} onValueChange={setIsPrivate} />
              <Text style={tw`ml-2`}>Private</Text>
            </View>
            <Button title="Update Carpool" onPress={handleUpdateCarpool} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} buttonStyle={{ backgroundColor: '#FF3B30' }} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    backgroundColor: '#007bff',
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
});

export default UserCarpoolGroups;
