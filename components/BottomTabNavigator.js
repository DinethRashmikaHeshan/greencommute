import React from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // For Ionicons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'; // For Material Icons
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'; // For Font Awesome icons
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const BottomTabNavigator = ({username,uid}) => {
  const navigation = useNavigation(); // Get navigation object
  const [scaleValue] = React.useState(new Animated.Value(1));
  const userId = username;

  const animateButton = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      {[
        { name: 'home', component: Icon, action: () => navigation.navigate('HomeScreen', { username }) }, // Navigate to HomeScreen
        { name: 'emergency-share', component: MaterialIcon, action: () => navigation.navigate('Contact', { userId }) },
        { name: 'leaf', component: Icon, action: () => navigation.navigate('CarbonFootprintMain', { username,uid }) },
        { name: 'feed', component: MaterialIcon, action: () => navigation.navigate('Rating', { username }) },
      ].map((icon, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            animateButton();
            icon.action(); // Call the action function for the icon
          }}
        >
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <icon.component name={icon.name} size={30} color="#003B36" />
          </Animated.View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
});

export default BottomTabNavigator;
