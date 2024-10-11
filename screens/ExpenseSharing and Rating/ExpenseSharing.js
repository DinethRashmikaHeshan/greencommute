import React, { useState } from 'react';
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

const ExpenseSharing = () => {
  // State variables for form inputs
  const [distance, setDistance] = useState('');
  const [fuelEfficiency, setFuelEfficiency] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [totalFee, setTotalFee] = useState('');
  const [additionalCost, setAdditionalCost] = useState('');
  const [passengerCount, setPassengerCount] = useState('');
  const [splitMethod, setSplitMethod] = useState('Equal');

  // Function to handle calculation
  const handleCalculate = () => {
    // Validate inputs
    const dist = parseFloat(distance);
    const efficiency = parseFloat(fuelEfficiency);
    const price = parseFloat(fuelPrice);
    const fee = parseFloat(totalFee);
    const additional = parseFloat(additionalCost);
    const passengers = parseInt(passengerCount);

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

    // Display result
    Alert.alert('Calculation Result', shareMessage);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Expense Sharing</Text>
      </View>

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
              value={distance}
              onChangeText={setDistance}
              placeholderTextColor="#a9a9a9"
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
            {/* Add more split methods if needed */}
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
    backgroundColor: '#f0f9f0', // Light green background for a fresh look
    padding: 11,
    paddingTop: 20, // Increased padding for better spacing on top
  },
  header: {
    backgroundColor: '#28a745', // Vibrant green color
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3, // Adds shadow for depth (Android)
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerText: {
    color: '#ffffff', // White text for contrast
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 1,
  },
  form: {
    backgroundColor: '#ffffff', // White background for form
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    paddingTop: 0,
  },
  label: {
    color: '#333333', // Dark grey for better readability
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#28a745', // Green border to match theme
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#f9f9f9', // Slightly off-white for better contrast
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  halfInputContainer: {
    flex: 0.48, // Approximately half width with some spacing
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#28a745',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    marginTop: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333333',
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#28a745', // Green button
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // Adds shadow for depth
  },
  buttonText: {
    color: '#ffffff', // White text
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default ExpenseSharing;
