import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//carbon footprint
import CarbonFootprintMain from "./screens/CarbonFootprintMain";
import ViewSavings from "./screens/ViewSavings";
import CalculateFootprint from "./screens/CalculateFootprint";
import SetGoals from "./screens/setGoals";
import GoalDetails from "./screens/GoalDetails";

import RouteSelectionScreen from "./screens/RouteSelectionScreen";
import MapScreen from "./screens/MapScreen";
import DeviationScreen from "./screens/DeviationScreen";
//carpool Rating
import CreateReview from './screens/ExpenseSharing and Rating/CreateReview';
import Review from './screens/ExpenseSharing and Rating/Review';
import ConnectivityTest from './screens/ExpenseSharing and Rating/ConnectivityTest';

//signup and login
import SignUp from './screens/Signup and Login/Signup';
import Login from './screens/Signup and Login/Login';


const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp">
       
        <Stack.Screen name="RouteSelection" component={RouteSelectionScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Deviation" component={DeviationScreen} />

        {/*Rating*/}
        <Stack.Screen name="CRating" component={CreateReview} />
        <Stack.Screen name="Rating" component={Review} />
        <Stack.Screen name="Test" component={ConnectivityTest} />

        {/*Carbon Footprint*/}
        <Stack.Screen name="CarbonFootprintMain" component={CarbonFootprintMain} />
        <Stack.Screen name="ViewSavings" component={ViewSavings} />
        <Stack.Screen name="CalculateFootprint" component={CalculateFootprint} />
        <Stack.Screen name="SetGoals" component={SetGoals} />
        <Stack.Screen name="GoalDetails" component={GoalDetails} />

        {/*signup and login*/}
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
