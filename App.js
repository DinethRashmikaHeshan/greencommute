import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import CarbonFootprintMain from "./screens/CarbonFootprintMain";
import ViewSavings from "./screens/ViewSavings";
import CalculateFootprint from "./screens/CalculateFootprint";
import SetGoals from "./screens/setGoals";
import GoalDetails from "./screens/GoalDetails";
import RouteSelectionScreen from "./screens/RouteSelectionScreen";
import MapScreen from "./screens/MapScreen";
import DeviationScreen from "./screens/DeviationScreen";

const Stack = createStackNavigator();
const App = () => {
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
        <Stack.Screen name="GoalDetails" component={GoalDetails} />

        <Stack.Screen name="RouteSelection" component={RouteSelectionScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Deviation" component={DeviationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
