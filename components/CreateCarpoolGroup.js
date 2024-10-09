import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'tailwind-react-native-classnames';
import Map from './Map'; // Ensure this path is correct
import { selectOrigin, selectDestination } from '../slices/navSlice';

const CreateCarpoolGroup = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [seats, setSeats] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  
  // Select origin and destination from Redux store
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const dispatch = useDispatch();

  const handleCreateGroup = () => {
    const carpoolGroup = {
      groupName,
      seats,
      isPrivate,
      origin: origin?.description,
      destination: destination?.description,
    };

    dispatch(saveCarpoolGroup(carpoolGroup));
    navigation.goBack();
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

      <Button title="Create Group" onPress={handleCreateGroup} />
    </View>
  );
};

export default CreateCarpoolGroup;
