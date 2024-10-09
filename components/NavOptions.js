import {  Text, View, FlatList, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { selectOrigin } from '../slices/navSlice';
import { useNavigation } from '@react-navigation/native';



const data = [
    {
        id: "123",
        title: "Create CarPool",
        image: require('../assets/create.png'),
        screen: "CreateCarPool"
    },
    {
        id: "456",
        title: "Manage CarPool",
        image: require('../assets/join.png'),
        screen: "UserCarpoolGroups"
    },
];

const NavOptions = ({username}) => {
    const navigation = useNavigation();
    const origin = useSelector(selectOrigin)

  return (
    <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity 
            onPress={() => navigation.navigate(item.screen, { username })}
            style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 m-2 w-40`} 
            disabled={!origin}
            >
                <View style={tw`${!origin && 'opacity-20'}`}>
                    <Image
                        style={{ width:120, height:120, resizeMode: "contain"}}
                        source={item.image}
                    />
                    <Text style={tw`mt-2 text-lg font-semibold`}>{item.title}</Text>
                    <Icon 
                    style={tw`p-2 bg-black rounded-full w-10 mt-4`}
                    name='arrowright' color="white" type='antdesign' />
                </View>
            </TouchableOpacity>
        )}
    />
  )
}

export default NavOptions;