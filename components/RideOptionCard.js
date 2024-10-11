import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'tailwind-react-native-classnames';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectTravelTimeInformation, selectOrigin, selectDestination } from '../slices/navSlice';
import { supabase } from '../lib/supabase';
import dayjs from 'dayjs';

const vehicleImages = {
  'Mini - Car': 'https://Links.papareact.com/3pn',
  'Car': 'https://Links.papareact.com/7pf',
  'Van': 'https://Links.papareact.com/5w8',
};

const RideOptionCard = ({ route }) => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);
  const [carpoolGroups, setCarpoolGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const { username } = route.params;

  useEffect(() => {
    const fetchCarpoolGroups = async () => {
      try {
        const currentTime = dayjs().toISOString();
        const { data, error } = await supabase
          .from('CreateCarpool')
          .select('id, group_name, seats, schedule_time, origin, destination, vehicle_id')
          .eq('is_private', false)
          .gt('seats', 0);

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        const filteredGroups = data.filter(group => {
          return (
            dayjs(group.schedule_time).isAfter(currentTime) &&
            group.origin === origin.description &&
            group.destination === destination.description
          );
        });

        // Fetch vehicle details for each group
        const formattedData = await Promise.all(filteredGroups.map(async (group) => {
          const { data: vehicleData, error: vehicleError } = await supabase
            .from('Vehicles')
            .select('vehicle_number, vehicle_type')
            .eq('id', group.vehicle_id)
            .single(); // Fetch the vehicle details for the carpool group

          if (vehicleError) {
            console.error("Error fetching vehicle data:", vehicleError.message);
          }

          return {
            id: group.id,
            title: group.group_name,
            availableSeats: group.seats,
            scheduleTime: group.schedule_time,
            vehicleNumber: vehicleData?.vehicle_number || 'Unknown Vehicle',
            vehicleType: vehicleData?.vehicle_type || 'Unknown Type',
            image: vehicleImages[vehicleData?.vehicle_type] || 'https://Links.papareact.com/default', // Use the mapping
          };
        }));

        setCarpoolGroups(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCarpoolGroups();
  }, [origin, destination]);

  const handleChooseCarpool = async () => {
    if (selected) {
      try {
        // Check if the user is already a member of the selected carpool group
        const { data: existingMembers, error: fetchError } = await supabase
          .from('CarpoolMembers')
          .select('*')
          .eq('carpool_id', selected.id)
          .eq('member_username', username);
  
        if (fetchError) {
          console.error("Error fetching existing members:", fetchError.message);
          return;
        }
  
        if (existingMembers.length > 0) {
          console.log("User is already a member of this carpool.");
          return;
        }
  
        const { error } = await supabase
          .from('CarpoolMembers')
          .insert([{ carpool_id: selected.id, member_username: username }]);

        const { error: updateError } = await supabase
          .from('CreateCarpool')
          .update({ seats: selected.availableSeats - 1 })
          .eq('id', selected.id);
  
        if (updateError) {
          console.error("Error updating seats:", updateError.message);
          return;
        }
  
        if (error) {
          console.error("Error adding member:", error.message);
        } else {
          console.log("Member added successfully!");
          // Optionally navigate to another screen or show success message
          const s = origin.location;
          const e = destination.location;

          // Transform lat/lng to latitude/longitude
          const start = {
            latitude: s.lat,
            longitude: s.lng,
          };

          const end = {
            latitude: e.lat,
            longitude: e.lng,
          };
          console.log(start,end);
          const userId = username;
          const carpoolId = '3';
          // rr // Replace with your desired screen
          navigation.navigate('HomeScreen', { username });
        }
      } catch (err) {
        console.error("Error:", err.message);
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500`}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`bg-white flex-grow justify-evenly`}>
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate('NavigateCard')}
          style={tw`absolute top-3 left-5 z-50 rounded-full`}
        >
          <Icon name="chevron-left" type="fontawesome" />
        </TouchableOpacity>
        <Text style={tw`text-center py-5 text-xl`}>
          Select a Ride - {travelTimeInformation?.distance.text}
        </Text>
      </View>

      <FlatList
        data={carpoolGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelected(item)}
            style={tw`flex-row justify-between items-center px-10 py-1 ${item.id === selected?.id && 'bg-gray-200'}`}
          >
            <Image
              style={{
                width: 85,
                height: 85,
                resizeMode: 'contain',
              }}
              source={{ uri: item.image }}
            />
            <View style={tw`-ml-6`}>
              <Text style={[tw`text-xl font-semibold`, { color: '#003B36' }]}>{item.title}</Text>
              <Text>{travelTimeInformation?.duration.text}</Text>
              <Text>Available Seats: {item.availableSeats}</Text>
              <Text>Vehicle: {item.vehicleNumber}</Text>
              <Text style={tw`font-semibold`}>{dayjs(item.scheduleTime).format('MMMM D h:mm A')}</Text>
            </View>
            <Text style={tw`text-xl`}>Rs.100/=</Text>
          </TouchableOpacity>
        )}
      />

      <View>
        <TouchableOpacity
          disabled={!selected}
          onPress={handleChooseCarpool}
          style={[
            tw`py-3 m-3`,
            { backgroundColor: selected ? '#003B36' : '#D3D3D3' }
          ]}
        >
          <Text style={tw`text-center text-white text-xl`}>
            Choose {selected?.title}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RideOptionCard;

const styles = StyleSheet.create({});
