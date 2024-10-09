import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'tailwind-react-native-classnames';
import { supabase } from '../lib/supabase';
import { selectOrigin, selectDestination } from '../slices/navSlice';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateCarpoolGroup = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [seats, setSeats] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Select origin and destination from Redux store
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const dispatch = useDispatch();

  const handleCreateGroup = async () => {
    // Ensure all fields are filled
    if (!groupName || !seats || !origin || !destination) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setLoading(true);

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
    <View style={tw`flex-1 p-5`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Create a Carpool Group</Text>
      
      <TextInput
        style={tw`border border-gray-300 p-2 mb-4 rounded-lg`}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />
      
      <TextInput
        style={tw`border border-gray-300 p-2 mb-4 rounded-lg`}
        placeholder="Available Seats"
        value={seats}
        onChangeText={setSeats}
        keyboardType="numeric" // Numeric input for seats
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

      <Button title="Select Date" onPress={showDatepicker} />
      <Button title="Select Time" onPress={showTimepicker} />

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

      <Text style={tw`mt-4`}>Scheduled Time: {scheduleDate.toLocaleString()}</Text>

      <Button title={loading ? "Creating..." : "Create Group"} onPress={handleCreateGroup} disabled={loading} />
    </View>
  );
};

export default CreateCarpoolGroup;
