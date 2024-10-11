import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Animated ,Image} from 'react-native';
import React, { useEffect, useRef } from 'react'; // Import useEffect and useRef
import tw from 'tailwind-react-native-classnames';
import { GOOGLE_MAPS_APIKEY } from "@env";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useDispatch } from 'react-redux';
import { setDestination } from '../slices/navSlice';
import { useNavigation } from '@react-navigation/native';
import NavFavourite from './NavFavourite';
import { Icon } from 'react-native-elements';

const NavigateCard = ({ route }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { username } = route.params;
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();

    // Animated value for the quote
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Function to trigger fade-in animation
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1, // Fully visible
            duration: 1500, // Duration of the fade-in
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    }, [fadeAnim]);

    return (
        <SafeAreaView style={tw`bg-white flex-1`}>
            <Text style={[tw`text-center py-5 text-xl font-semibold`, { color: '#003B36' }]}>
                Good Morning, {capitalizedUsername}!
            </Text>

            <View style={tw`border-t border-gray-200 flex-shrink`}>
                <View>
                    <GooglePlacesAutocomplete
                        placeholder="Where to?"
                        styles={toInputBoxStyles}
                        fetchDetails={true}
                        returnKeyType={"search"}
                        minLength={2}
                        onPress={(data, details = null) => {
                            dispatch(setDestination({
                                location: details.geometry.location,
                                description: data.description,
                            }));
                        }}
                        enablePoweredByContainer={false}
                        query={{
                            key: GOOGLE_MAPS_APIKEY,
                            language: "en",
                        }}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        debounce={400}
                    />
                </View>

                <NavFavourite />

                {/* Animated Quote */}
                <Animated.View style={[{ opacity: fadeAnim }, tw`flex items-center justify-center my-4`]}>
                <Image 
                    style={{
                        width: 125,
                        height: 125,
                        resizeMode: "contain"
                    }}
                    source={require('../assets/saveMoney.png')}
                />
            </Animated.View>
            </View>

            <View style={tw`flex-row bg-white justify-evenly py-2 mt-auto border-t border-gray-100`}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('CreateCarpoolGroup', { username })}
                    style={[tw`flex flex-row justify-between w-24 px-4 py-3 rounded-full`, { backgroundColor: '#003B36' }]}>
                    <Icon name="group" type="MaterialIcons" color="white" size={16} />
                    <Text style={tw`text-white text-center`}>Create</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('RideOptionCard', { username })}
                    style={tw`flex flex-row justify-between w-24 px-4 py-3 rounded-full`}>
                    <Icon name="group-add" type="MaterialIcons" color="black" size={16} />
                    <Text style={tw`text-center`}>Join</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default NavigateCard;

const toInputBoxStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        paddingTop: 20,
        flex: 0,
    },
    textInput: {
        backgroundColor: "#DDDDDF",
        borderRadius: 0,
        fontSize: 18,
    },
    textInputContainer: {
        paddingHorizontal: 20,
        paddingBottom: 0,
    }
});
