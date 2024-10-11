import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../lib/supabase'; // Ensure correct path
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const ExpenseSharing = ({ route }) => {  // Receive route via props
  const navigation = useNavigation(); // Access navigation

  // State variables for form inputs
  const [distance, setDistance] = useState('');
  const [fuelEfficiency, setFuelEfficiency] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [totalFee, setTotalFee] = useState('');
  const [additionalCost, setAdditionalCost] = useState('');
  const [passengerCount, setPassengerCount] = useState('');
  const [splitMethod, setSplitMethod] = useState('Equal');

  const { username, routeDistance, carpoolId } = route.params; // Extract username and other params

  useEffect(() => {
    if (routeDistance) {
      setDistance((routeDistance / 1000).toFixed(2)); // Convert meters to kilometers with 2 decimal places
    }
    console.log(distance);
  }, [routeDistance]);

  // Function to handle calculation and update the database
  const handleCalculate = async () => {
    // Validate inputs
    const dist = parseFloat(distance);
    const efficiency = parseFloat(fuelEfficiency);
    const price = parseFloat(fuelPrice);
    const fee = parseFloat(totalFee);
    const additional = parseFloat(additionalCost);
    const passengers = parseInt(passengerCount, 10);

    if (
      isNaN(dist) || 
      isNaN(efficiency) ||    
      isNaN(price) || 
      isNaN(fee) || 
      isNaN(additional) || 
      isNaN(passengers) || 
      passengers <= 0
    ) {
      Alert.alert('Invalid Input', 'Please enter valid numbers in all fields.');
      return;
    }

    // Calculate total fuel cost
    const fuelCost = (dist / efficiency) * price;

    // Total expenses before app charge
    const totalExpenses = fuelCost + fee + additional;

    // Calculate app charge (3% of total expenses)
    const appCharge = 0.03 * totalExpenses;

    // Total expenses including app charge
    const totalWithAppCharge = totalExpenses + appCharge;

    let shareMessage = '';

    if (splitMethod === 'Equal') {
      const share = totalWithAppCharge / passengers;
      shareMessage = 
        `Total Expense: Rs.${totalExpenses.toFixed(2)}\n` +
        `App Charge (3%): Rs.${appCharge.toFixed(2)}\n` +
        `Total with App Charge: Rs.${totalWithAppCharge.toFixed(2)}\n\n` +
        `Each passenger should pay: Rs.${share.toFixed(2)}`;
    } else if (splitMethod === 'Owner-priority') {
      const ownerShare = 0.2 * totalExpenses;
      const remainingPassengers = passengers - 1;

      if (remainingPassengers <= 0) {
        Alert.alert('Invalid Passenger Count', 'Passenger count must be at least 2 for Owner-priority split.');
        return;
      }

      const othersShare = (0.8 * totalExpenses) / remainingPassengers;

      // Calculate app charge share per passenger
      const appChargePerPassenger = appCharge / passengers;

      const totalOwnerShare = ownerShare + appChargePerPassenger;
      const totalOthersShare = othersShare + appChargePerPassenger;

      shareMessage = 
        `Total Expense: Rs.${totalExpenses.toFixed(2)}\n` +
        `App Charge (3%): Rs.${appCharge.toFixed(2)}\n` +
        `Total with App Charge: Rs.${totalWithAppCharge.toFixed(2)}\n\n` +
        `Owner should pay: Rs.${totalOwnerShare.toFixed(2)}\n` +
        `Each passenger should pay: Rs.${totalOthersShare.toFixed(2)}`;
    } else {
      // Default to equal split if an unknown method is selected
      const share = totalWithAppCharge / passengers;
      shareMessage = 
        `Total Expense: Rs.${totalExpenses.toFixed(2)}\n` +
        `App Charge (3%): Rs.${appCharge.toFixed(2)}\n` +
        `Total with App Charge: Rs.${totalWithAppCharge.toFixed(2)}\n\n` +
        `Each passenger should pay: Rs.${share.toFixed(2)}`;
    }

    // Display result with Finish button
    Alert.alert(
      'Calculation Result',
      shareMessage,
      [
        {
          text: 'OK',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Finish',
          onPress: () => navigation.navigate('HomeScreen', { username }),
        },
      ],
      { cancelable: false }
    );

    // Proceed to update the users table in the database
    try {
      // Fetch the user record based on username
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('amountToPay')
        .eq('username', username)
        .single(); // Assuming usernames are unique

      if (fetchError) {
        console.error('Error fetching user:', fetchError);
        Alert.alert('Error', 'Failed to fetch user data.');
        return;
      }

      let updatedAmountToPay = appCharge;

      if (userData && userData.amountToPay) {
        updatedAmountToPay += parseFloat(userData.amountToPay);
      }

      // Update the user's amountToPay in the database
      const { error: updateError } = await supabase
        .from('users')
        .update({ amountToPay: updatedAmountToPay })
        .eq('username', username);

      if (updateError) {
        console.error('Error updating amountToPay:', updateError);
        Alert.alert('Error', 'Failed to update payment information.');
        return;
      }

      console.log(`Updated amountToPay for ${username}: Rs.${updatedAmountToPay.toFixed(2)}`);
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Expense Sharing</Text>
      </View>

      {/* Username display */}
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>

      {/* Form */}
      <View style={styles.form}>
        {/* Distance and Fuel Efficiency in the same row */}
        <View style={styles.row}>
          {/* Distance Input */}
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Distance (km):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter trip distance"
              keyboardType="numeric"
              value={String(distance)}
              onChangeText={setDistance}
              placeholderTextColor="#a9a9a9"
              editable={false} // Make it non-editable
            />
          </View>

          {/* Fuel Efficiency Input */}
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Fuel Efficiency (kmpl):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter fuel efficiency"
              keyboardType="numeric"
              value={fuelEfficiency}
              onChangeText={setFuelEfficiency}
              placeholderTextColor="#a9a9a9"
            />
          </View>
        </View>

        {/* Fuel Price Input */}
        <Text style={styles.label}>Fuel Price (per litre):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter fuel price per litre"
          keyboardType="numeric"
          value={fuelPrice}
          onChangeText={setFuelPrice}
          placeholderTextColor="#a9a9a9"
        />

        {/* Toll Fee and Additional Cost in the same row */}
        <View style={styles.row}>
          {/* Toll Fee Input */}
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Toll Fee:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter toll fees"
              keyboardType="numeric"
              value={totalFee}
              onChangeText={setTotalFee}
              placeholderTextColor="#a9a9a9"
            />
          </View>

          {/* Additional Cost Input */}
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Additional Cost:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter other costs"
              keyboardType="numeric"
              value={additionalCost}
              onChangeText={setAdditionalCost}
              placeholderTextColor="#a9a9a9"
            />
          </View>
        </View>

        {/* Passenger Count Input */}
        <Text style={styles.label}>Passenger Count:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of passengers"
          keyboardType="numeric"
          value={passengerCount}
          onChangeText={setPassengerCount}
          placeholderTextColor="#a9a9a9"
        />

        {/* Split Method Dropdown */}
        <Text style={styles.label}>Split Method:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={splitMethod}
            onValueChange={(itemValue) => setSplitMethod(itemValue)}
            style={styles.picker}
            dropdownIconColor="#28a745"
          >
            <Picker.Item label="Equal" value="Equal" />
            <Picker.Item label="Owner-priority" value="Owner-priority" />
          </Picker>
        </View>

        {/* Calculate Button */}
        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f9f0', 
    padding: 11,
    paddingTop: 20, 
  },
  header: {
    backgroundColor: '#28a745', 
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerText: {
    color: '#ffffff', 
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#ffffff', 
    padding: 15,
    borderRadius: 10,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  label: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#28a745', 
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#28a745', 
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    color: '#000',
  },
  button: {
    backgroundColor: '#28a745', 
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff', 
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ExpenseSharing;
