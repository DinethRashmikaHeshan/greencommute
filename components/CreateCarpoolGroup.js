import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, Alert, Platform, Modal, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'tailwind-react-native-classnames';
import { supabase } from '../lib/supabase';
import { selectTravelTimeInformation, selectOrigin, selectDestination } from '../slices/navSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Icon } from 'react-native-elements'; // Import Icon component

const CreateCarpoolGroup = ({ navigation, route }) => {
  const [groupName, setGroupName] = useState('');
  const [seats, setSeats] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [vehicleId, setVehicleId] = useState(null); // State to hold selected vehicle ID
  const [vehicles, setVehicles] = useState([]); // State to hold fetched vehicles
  const [showVehicleModal, setShowVehicleModal] = useState(false); // State to control vehicle selection modal

  const { username } = route.params;
  const travelTimeInformation = useSelector(selectTravelTimeInformation);

  // Select origin and destination from Redux store
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchVehicles(); // Fetch vehicles when component mounts
  }, []);

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from('Vehicles')
      .select('*')
      .eq('owner_name', username); // Fetch vehicles for the current user

    if (error) {
      console.error('Error fetching vehicles:', error);
      return;
    }

    setVehicles(data);
  };

  const handleCreateGroup = async () => {
    // Ensure all fields are filled
    if (!groupName || !seats || !origin || !destination || !vehicleId) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setLoading(true);

    // Extract distance as a float from the travelTimeInformation
    const distanceText = travelTimeInformation.distance.text;
    const distanceValue = parseFloat(distanceText.replace(/[^0-9.]/g, '')); // Extract numeric value

    // Insert carpool group data into the CreateCarpool table
    const { error } = await supabase
      .from('CreateCarpool') // Ensure this table exists in your Supabase database
      .insert([{
        group_name: groupName,
        seats: seats,
        is_private: isPrivate,
        origin: origin.description,
        destination: destination.description,
        schedule_time: scheduleDate.toISOString(), // Save the scheduled time in ISO format
        owner: username, // Save the username to the database
        distance: distanceValue, // Save the distance as a float
        vehicle_id: vehicleId // Include selected vehicle ID
      }]);

    if (error) {
      console.error('Error saving carpool group:', error);
      Alert.alert('Error', 'Failed to create carpool group.');
      setLoading(false);
      return; // Ensure to stop execution on error
    }

    // Clear input fields after successful creation
    setGroupName('');
    setSeats('');
    setIsPrivate(false);
    setScheduleDate(new Date());
    setVehicleId(null); // Clear vehicle selection

    Alert.alert('Success', 'Carpool group created successfully!');
    navigation.goBack();
    setLoading(false);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || scheduleDate;
    setShowDatePicker(Platform.OS === 'ios');
    setScheduleDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || scheduleDate;
    setShowTimePicker(Platform.OS === 'ios');
    setScheduleDate(currentTime);
  };

  return (
    <View style={[tw`flex-1 p-5 bg-white`]}>
      <Text style={tw`text-2xl font-bold mb-4`}>Create a Carpool Group</Text>
      
      <View style={tw`flex-row items-center border border-gray-300 p-2 mb-4 rounded-lg`}>
        <Icon name='group' type='material' color='#003B36' />
        <TextInput
          style={tw`flex-1 ml-2`}
          placeholder="Group Name"
          value={groupName}
          onChangeText={setGroupName}
        />
      </View>

      <View style={tw`flex-row items-center border border-gray-300 p-2 mb-4 rounded-lg`}>
        <Icon name='people' type='material' color='#003B36' />
        <TextInput
          style={tw`flex-1 ml-2`}
          placeholder="Available Seats"
          value={seats}
          onChangeText={setSeats}
          keyboardType="numeric" // Numeric input for seats
        />
      </View>
      
      <View style={tw`flex-row items-center mb-4`}>
        <Icon name='lock' type='material' color='#003B36' />
        <Text style={tw`mr-2`}>Private Group:</Text>
        <Switch
          value={isPrivate}
          onValueChange={setIsPrivate}
          trackColor={{ false: "#003B36", true: "#009688" }}
          thumbColor={isPrivate ? "#003B36" : "#009688"}
        />
      </View>

      <TouchableOpacity onPress={() => setShowVehicleModal(true)} style={tw`border border-gray-300 p-2 mb-4 rounded-lg flex-row items-center`}>
        <Icon name='directions-car' type='material' color='#003B36' />
        <Text style={tw`flex-1 ml-2`}>
          {vehicleId ? vehicles.find(v => v.id === vehicleId)?.vehicle_number : 'Select Vehicle'}
        </Text>
      </TouchableOpacity>

      <View style={tw`flex-row mb-4`}>
        <View style={tw`flex-1 mr-2`}>
          <Button title="Select Date" onPress={showDatepicker} color="#009688" />
        </View>
        <View style={tw`flex-1 ml-2`}>
          <Button title="Select Time" onPress={showTimepicker} color="#009688" />
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={scheduleDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={scheduleDate}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}

      <Text style={tw`font-semibold`}>Scheduled Time: {scheduleDate.toLocaleString()}</Text>

      <Button title={loading ? "Creating..." : "Create Group"} onPress={handleCreateGroup} disabled={loading} color="#003B36"/>

      {/* Vehicle Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showVehicleModal}
        onRequestClose={() => setShowVehicleModal(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}>
          <View style={tw`bg-white rounded-lg p-5 w-80`}>
            <Text style={tw`text-lg font-bold mb-4`}>Select Vehicle</Text>
            {vehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                onPress={() => {
                  setVehicleId(vehicle.id);
                  setShowVehicleModal(false);
                }}
                style={tw`border p-2 rounded mb-2 flex-row items-center`}
              >
                <Icon name='directions-car' type='material' color='#003B36' />
                <Text className="ml-2">{vehicle.vehicle_number} ({vehicle.vehicle_type})</Text>
              </TouchableOpacity>
            ))}
            <Button title="Close" onPress={() => setShowVehicleModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateCarpoolGroup;
