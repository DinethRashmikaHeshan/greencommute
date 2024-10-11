// HomeScreen.js
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setOrigin, setDestination } from "../slices/navSlice";
import NavFavourite from "../components/NavFavourite";
import BottomTabNavigator from "../components/BottomTabNavigator";

const HomeScreen = ({ route }) => {
  const dispatch = useDispatch();
  const { username, uid } = route.params;
  console.log(username);
  console.log(uid);

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
          }}
          source={require("../assets/Logo.png")}
        />

        <GooglePlacesAutocomplete
          placeholder="Where From?"
          styles={{
            container: {
              flex: 0,
            },
            textInput: {
              fontSize: 18,
            },
          }}
          onPress={(data, details = null) => {
            dispatch(
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              })
            );
            dispatch(setDestination(null));
          }}
          fetchDetails={true}
          returnKeyType={"search"}
          enablePoweredByContainer={false}
          minLength={2}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en",
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
        />

        <NavOptions username={username} />
        <NavFavourite />
      </View>

      {/* Bottom Tab Navigator */}
      <BottomTabNavigator username={username} uid={uid} />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    color: "blue",
  },
});
