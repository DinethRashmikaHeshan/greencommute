import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity ,FlatList,Image} from 'react-native'
import React, { useState } from 'react'
import tw from 'tailwind-react-native-classnames'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { selectTravelTimeInformation } from '../slices/navSlice'

const data = [
    {
        id: "Uber-XL-123", 
        title: "CarPool 1", 
        multiplier: 1.2, 
        image: "https://Links.papareact.com/7pf",
    },
    {
        id: "Uber-XL-456", 
        title: "CarPool 2", 
        multiplier: 1.2, 
        image: "https://Links.papareact.com/7pf",
    },
    {
        id: "Uber-XL-789", 
        title: "CarPool 3", 
        multiplier: 1.2, 
        image: "https://Links.papareact.com/7pf",
    }
]

const RideOptionCard = () => {
    const navigation = useNavigation()
    const [selected, setSelected] = useState(null)
    const travelTimeInformation = useSelector(selectTravelTimeInformation)

  return (
    <SafeAreaView style={tw`bg-white flex-grow justify-evenly`}>
        <View>
            <TouchableOpacity 
                onPress={() => navigation.navigate("NavigateCard")}
                style={tw`absolute top-3 left-5 z-50 rounded-full`}
            >
                <Icon name="chevron-left" type="fontawesome" />
            </TouchableOpacity>
            <Text style={tw`text-center py-5 text-xl`}>Select a Ride - {travelTimeInformation?.distance.text}</Text>
        </View>

        <FlatList data={data}
            keyExtractor={(item) => item.id}
            renderItem={({item:{id, title, multiplier, image}, item}) => (
                <TouchableOpacity 
                onPress={() => setSelected(item)}
                style={tw`flex-row justify-between items-center px-10 ${id === selected?.id && 'bg-gray-200'}` }>
                    <Image
                        style={{
                            width: 100, 
                            height: 100, 
                            resizeMode:"contain",
                        }}
                        source={{ uri: image }}
                    />

                    <View style={tw`-ml-6`}>
                       <Text style={tw`text-xl font-semibold`}>{title}</Text> 
                       <Text>{travelTimeInformation?.duration.text} Travel Time</Text> 
                    </View>
                    <Text style={tw`text-xl`}>Rs.100/=</Text>
                </TouchableOpacity>
            )}
        />

        <View>
            <TouchableOpacity disabled={!selected} style={tw`bg-black py-3 m-3 ${!selected && 'bg-gray-300'} `}>
                <Text style={tw`text-center text-white text-xl`}>Choose {selected?.title}</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default RideOptionCard

const styles = StyleSheet.create({})