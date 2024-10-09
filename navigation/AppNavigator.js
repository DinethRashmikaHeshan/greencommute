import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import CreateReview from "../screens/CreateReview";
import Review from "../screens/Review";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CreateReview">
        <Stack.Screen
          name="CreateReview"
          component={CreateReview}
        />
        <Stack.Screen
        name="Review"
        component={Review}
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;