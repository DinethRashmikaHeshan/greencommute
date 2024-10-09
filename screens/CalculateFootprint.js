import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import TipsComponent from "./TipsComponent"; // Import the TipsComponent

const CalculateFootprint = () => {
  const [fuelConsumption, setFuelConsumption] = useState("");
  const [fuelType, setFuelType] = useState(""); // Start with an empty string
  const [distance, setDistance] = useState("");
  const [result, setResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Petrol", value: "petrol" },
    { label: "Diesel", value: "diesel" },
  ]);

  // Corrected calculation function
  const calculateFootprint = () => {
    if (fuelConsumption && distance) {
      // Emission factors
      const emissionFactor = fuelType === "diesel" ? 2.54 : 2.31; // 2.54 for diesel, 2.31 for petrol

      // Total fuel used = (fuel consumption * distance) / 100
      const totalFuelUsed =
        (parseFloat(fuelConsumption) * parseFloat(distance)) / 100;

      // Carbon footprint calculation
      const footprint = (totalFuelUsed * emissionFactor).toFixed(2); // in kg CO2

      setResult(footprint);
    } else {
      setResult("Please enter valid values.");
    }
  };

  // Handle dropdown selection
  const handleDropdownChange = (value) => {
    setFuelType(value);
    setOpen(false); // Close dropdown after selection
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeading}>Calculate Your Eco Footprint</Text>
      <Text style={styles.subHeading}>
        Uncover Your Carbon Emissions and Make a Difference!
      </Text>

      {/* Container for input fields and button */}
      <View style={styles.calculatorContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Fuel Consumption:</Text>
          <TextInput
            style={styles.input}
            placeholder="liters per 100km"
            keyboardType="numeric"
            value={fuelConsumption}
            onChangeText={(text) => setFuelConsumption(text)}
          />
        </View>

        <View style={[styles.row, { zIndex: 1000 }]}>
          <Text style={styles.label}>Fuel Type:</Text>
          <DropDownPicker
            open={open}
            value={fuelType}
            items={items}
            setOpen={setOpen}
            setValue={setFuelType}
            setItems={setItems}
            containerStyle={{ height: open ? 50 : 50, flex: 1 }}
            dropDownContainerStyle={[
              styles.dropDownContainer,
              { zIndex: 1000 },
            ]}
            placeholder="Select fuel type"
            placeholderStyle={styles.placeholderStyle}
            searchable={false}
            style={styles.input}
          />
        </View>

        <View style={[styles.row, { zIndex: 500 }]}>
          <Text style={styles.label}>Distance Traveled:</Text>
          <TextInput
            style={styles.input}
            placeholder="km"
            keyboardType="numeric"
            value={distance}
            onChangeText={(text) => setDistance(text)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={calculateFootprint}>
          <Text style={styles.buttonText}>🧮 Calculate</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View>
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              Estimated CO2 Emissions: {result} kg
            </Text>
          </View>

          {/* Render TipsComponent and pass the result as a prop */}
          <TipsComponent result={result} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFF5E1", // Light green background
    padding: 20,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#2E7D32",
    textTransform: "uppercase",
  },
  subHeading: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#4A4A4A",
  },
  calculatorContainer: {
    backgroundColor: "#B2E5B0", // Light green background for the calculator section
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 0,
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  dropDownContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 0,
    flex: 1,
  },
  placeholderStyle: {
    color: "#999",
  },
  button: {
    backgroundColor: "#2E7D32", // Green button
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  resultContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3, // Adds shadow for Android
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
});

export default CalculateFootprint;
