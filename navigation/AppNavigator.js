import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import CarbonFootprintMain from "../screens/CarbonFootprintMain";
import ViewSavings from "../screens/ViewSavings";
import CalculateFootprint from "../screens/CalculateFootprint";
import SetGoals from "../screens/setGoals";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CarbonFootprintMain">
        <Stack.Screen
          name="CarbonFootprintMain"
          component={CarbonFootprintMain}
        />
        <Stack.Screen name="ViewSavings" component={ViewSavings} />
        <Stack.Screen
          name="CalculateFootprint"
          component={CalculateFootprint}
        />
        <Stack.Screen name="SetGoals" component={SetGoals} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
