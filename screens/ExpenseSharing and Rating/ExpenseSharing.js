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
import DropDownPicker from 'react-native-dropdown-picker';  // Import DropDownPicker
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

  // Dropdown state
  const [open, setOpen] = useState(false); // Control the dropdown visibility
  const [splitMethod, setSplitMethod] = useState('Equal');
  const [splitMethods, setSplitMethods] = useState([
    { label: 'Equal', value: 'Equal' },
    { label: 'Owner-priority', value: 'Owner-priority' }
  ]);

  const { username, routeDistance, carpoolId } = route.params; // Extract username and other params

  useEffect(() => {
    if (routeDistance) {
      setDistance((routeDistance * 1.60934).toFixed(2)); // Convert meters to kilometers with 2 decimal places
    }
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
          onPress: async () => {
            // Update the CreateCarpool table
            try {
              console.log(carpoolId)
              const { error: updateCarpoolError } = await supabase
                .from('CreateCarpool')
                .update({ isStart: false })  // Set isStart to false
                .eq('id', carpoolId);   // Match by username
  
              if (updateCarpoolError) {
                console.error('Error updating isStart:', updateCarpoolError);
                Alert.alert('Error', 'Failed to update carpool status.');
                return;
              }
              navigation.navigate('HomeScreen', { username });
            } catch (error) {
              console.error('Unexpected error:', error);
              Alert.alert('Error', 'An unexpected error occurred while updating carpool status.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Expense Sharing</Text>
      </View>

      <Text style={styles.welcomeText}>Welcome, {username}!</Text>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Distance (km):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter trip distance"
              keyboardType="numeric"
              value={String(distance)}
              onChangeText={setDistance}
              placeholderTextColor="#a9a9a9"
              editable={false}
            />
          </View>

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

        <Text style={styles.label}>Fuel Price (per litre):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter fuel price per litre"
          keyboardType="numeric"
          value={fuelPrice}
          onChangeText={setFuelPrice}
          placeholderTextColor="#a9a9a9"
        />

        <View style={styles.row}>
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

        <Text style={styles.label}>Passenger Count:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of passengers"
          keyboardType="numeric"
          value={passengerCount}
          onChangeText={setPassengerCount}
          placeholderTextColor="#a9a9a9"
        />

        <Text style={styles.label}>Split Method:</Text>
        <View style={styles.pickerContainer}>
          <DropDownPicker
            open={open}
            value={splitMethod}
            items={splitMethods}
            setOpen={setOpen}
            setValue={setSplitMethod}
            setItems={setSplitMethods}
            containerStyle={styles.picker}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    flex: 0.48,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop:  100
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExpenseSharing;
