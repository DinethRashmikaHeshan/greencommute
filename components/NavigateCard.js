import { StyleSheet, Text, View, SafeAreaView , TouchableOpacity} from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames'
import { GOOGLE_MAPS_APIKEY } from "@env"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useDispatch } from 'react-redux'
import { setDestination } from '../slices/navSlice'
import { useNavigation } from '@react-navigation/native'
import NavFavourite from './NavFavourite'
import { Icon } from 'react-native-elements'

const NavigateCard = ({route}) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { username } = route.params;

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <Text style={[tw`text-center py-5 text-xl font-semibold`,{ color:'#009688'}]}>Good Morning, {username}!</Text>
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
                    })
                    );

                    // navigation.navigate('RideOptionCard')

                }}
                enablePoweredByContainer={false}
                query={{
                    key: GOOGLE_MAPS_APIKEY,
                    language: "en"
                }}
                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={400}
            />
        </View>

        <NavFavourite/>

      </View>

      <View style={tw`flex-row bg-white justify-evenly py-2 mt-auto border-t border-gray-100`}>
        <TouchableOpacity 
        onPress={() => navigation.navigate('CreateCarpoolGroup', { username })}
        style={[tw`flex flex-row justify-between w-24 px-4 py-3 rounded-full`,  { backgroundColor: '#003B36' }]}>
            <Icon name="car" type="font-awesome" color="white" size={16}/>
            <Text style={tw`text-white text-center`}>Create</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        onPress={() => navigation.navigate('RideOptionCard', { username })}
        style={tw`flex flex-row justify-between w-24 px-4 py-3 rounded-full`}>
            <Icon name="car" type="ionicon" color="black" size={16}/>
            <Text style={tw`text-center`}>Join</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default NavigateCard

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
})