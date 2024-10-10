import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'tailwind-react-native-classnames';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectTravelTimeInformation, selectOrigin, selectDestination } from '../slices/navSlice';
import { supabase } from '../lib/supabase';
import dayjs from 'dayjs';

const RideOptionCard = ( {route} ) => {
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
          .select('id, group_name, seats, schedule_time, origin, destination')
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

        const formattedData = filteredGroups.map((group, index) => ({
          id: group.id, // Use the actual group ID here for storing later
          title: group.group_name,
          availableSeats: group.seats,
          scheduleTime: group.schedule_time,
          image: 'https://Links.papareact.com/7pf',
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
        // Insert the current user as a member in the selected carpool group
        const { error } = await supabase
          .from('CarpoolMembers')
          .insert([
            {
                carpool_id: selected.id,
                member_username: username, // Assuming username is passed from route params
            },
          ]);

           // Decrement the seats by 1 for the selected carpool group
        const { error: updateError } = await supabase
        .from('CreateCarpool')
        .update({ seats: selected.availableSeats - 1 }) // Update the seats
        .eq('id', selected.id); // Only update the specific carpool group

        if (updateError) {
        console.error("Error updating seats:", updateError.message);
        return;
        }

        if (error) {
          console.error("Error adding member:", error.message);
        } else {
          console.log("Member added successfully!");
          // Optionally navigate to another screen or show success message
          navigation.navigate('HomeScreen', { username }); // Replace with your desired screen
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
            style={tw`flex-row justify-between items-center px-10 ${item.id === selected?.id && 'bg-gray-200'}`}
          >
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: 'contain',
              }}
              source={{ uri: item.image }}
            />

            <View style={tw`-ml-6`}>
              <Text style={tw`text-xl font-semibold`}>{item.title}</Text>
              <Text>{travelTimeInformation?.duration.text} Travel Time</Text>
              <Text>Available Seats: {item.availableSeats}</Text>
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
            { backgroundColor: selected ? '#003B36' : '#D3D3D3' } // Use your custom color
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
