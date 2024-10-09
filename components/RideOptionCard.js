import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'tailwind-react-native-classnames';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectTravelTimeInformation, selectOrigin, selectDestination } from '../slices/navSlice';
import { supabase } from '../lib/supabase';
import dayjs from 'dayjs';

const RideOptionCard = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);
  const [carpoolGroups, setCarpoolGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);

  useEffect(() => {
    const fetchCarpoolGroups = async () => {
      try {
        // Get current date and time
        const currentTime = dayjs().toISOString();

        // Fetch carpool groups from Supabase where is_private is false
        const { data, error } = await supabase
          .from('CreateCarpool')
          .select('group_name, seats, schedule_time, origin, destination') // Include origin and destination
          .eq('is_private', false) // Filter to only non-private groups
          .gt('seats', 0); // Filter to only groups with available seats

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        // Filter the groups based on origin, destination, and schedule_time after current time
        const filteredGroups = data.filter(group => {
          return (
            dayjs(group.schedule_time).isAfter(currentTime) &&
            group.origin === origin.description && // Check if origin matches
            group.destination === destination.description // Check if destination matches
          );
        });

        // Map the filtered data to match the format expected in the FlatList
        const formattedData = filteredGroups.map((group, index) => ({
          id: `Carpool-${index}`,
          title: group.group_name,
          availableSeats: group.seats,
          scheduleTime: group.schedule_time,
          image: 'https://Links.papareact.com/7pf', // Placeholder image, replace as needed
        }));

        setCarpoolGroups(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCarpoolGroups();
  }, [origin, destination]); // Run this effect when origin or destination changes

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
          style={tw`bg-black py-3 m-3 ${!selected && 'bg-gray-300'}`}
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
