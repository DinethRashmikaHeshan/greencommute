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

    // Total expenses
    const totalExpenses = fuelCost + fee + additional;

    let ownerShare = 0;
    let othersShare = 0;
    let shareMessage = '';

    if (splitMethod === 'Equal') {
      const share = totalExpenses / passengers;
      shareMessage = `Each passenger should pay: Rs.${share.toFixed(2)}`;
    } else if (splitMethod === 'Owner-priority') {
      ownerShare = 0.2 * totalExpenses;
      const remainingPassengers = passengers - 1;

      if (remainingPassengers <= 0) {
        Alert.alert('Invalid Passenger Count', 'Passenger count must be at least 2 for Owner-priority split.');
        return;
      }

      othersShare = (0.8 * totalExpenses) / remainingPassengers;
      shareMessage = `Owner should pay: Rs.${ownerShare.toFixed(2)}\nEach passenger should pay: Rs.${othersShare.toFixed(2)}`;
    } else {
      // Default to equal split if an unknown method is selected
      const share = totalExpenses / passengers;
      shareMessage = `Each passenger should pay: Rs.${share.toFixed(2)}`;
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
              placeholder="Enter distance in km"
              keyboardType="numeric"
              value={distance}
              onChangeText={setDistance}
            />
          </View>

          {/* Fuel Efficiency Input */}
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Fuel Efficiency (kmpl):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter fuel efficiency in kmpl"
              keyboardType="numeric"
              value={fuelEfficiency}
              onChangeText={setFuelEfficiency}
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
        />

        {/* Toll Fee and Additional Cost in the same row */}
        <View style={styles.row}>
          {/* Toll Fee Input */}
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Toll Fee:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter toll fee"
              keyboardType="numeric"
              value={totalFee}
              onChangeText={setTotalFee}
            />
          </View>

          {/* Additional Cost Input */}
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Additional Cost:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter additional cost"
              keyboardType="numeric"
              value={additionalCost}
              onChangeText={setAdditionalCost}
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
        />

        {/* Split Method Dropdown */}
        <Text style={styles.label}>Split Method:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={splitMethod}
            onValueChange={(itemValue) => setSplitMethod(itemValue)}
            style={styles.picker}
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
    backgroundColor: '#ffffff', // White background
    padding: 20,
    // Removed fixed width to make it responsive
    width: 367
  },
  header: {
    backgroundColor: '#28a745', // Green color
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50, // Retained marginTop as per user code
  },
  headerText: {
    color: '#ffffff', // White text
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
  },
  label: {
    color: '#000000', // Black text
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#28a745', // Green border
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000000', // Black text
    backgroundColor: '#ffffff', // White background
    width: '100%', // Ensure full width within container
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10, // Adjusted margin for better spacing
  },
  halfInputContainer: {
    flex: 0.48, // Takes up roughly half the width
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#28a745', // Green border
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#ffffff', // White background
    marginTop: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#000000', // Black text
  },
  button: {
    backgroundColor: '#28a745', // Green background
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#ffffff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExpenseSharing;
