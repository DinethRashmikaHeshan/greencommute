import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const CarbonFootprintMain = ({ route, navigation }) => {
  const { username, uid } = route.params; // Get username and uid from route params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Carbon Footprint</Text>
      <Text style={styles.subtitle}>
        Monitor, Calculate, and Reduce Your CO2 Emissions for a Greener Commute
      </Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ViewSavings", { username, uid })}
      >
        <Image
          source={require("../assets/savings.png")}
          style={styles.cardImage}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>View Carbon Savings</Text>
          <Text style={styles.cardDescription}>
            Track your CO2 savings over time.
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("CalculateFootprint", { username, uid })
        }
      >
        <Image
          source={require("../assets/calculator.png")}
          style={styles.cardImage}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Calculate Your Footprint</Text>
          <Text style={styles.cardDescription}>
            Calculate your emissions based on your travel.
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("SetGoals", { username, uid })}
      >
        <Image
          source={require("../assets/goals.png")}
          style={styles.cardImage}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Set Reduction Goals</Text>
          <Text style={styles.cardDescription}>
            Set and track your CO2 reduction goals.
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFF5E1", // Light green background color
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
    color: "#2E7D32",
    textShadowColor: "#A8DAB5", // Light shadow color for a soft effect
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "600", // Semi bold font weight
    color: "#555", // A slightly darker color for contrast
    marginTop: 5, // Add some space between title and subheading
  },
  card: {
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Vertically center the items
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardImage: {
    width: 80, // Increased width for better visibility
    height: 80, // Increased height for better visibility
    borderRadius: 10,
    marginRight: 20, // Add some space between the image and the text
  },
  cardTextContainer: {
    flex: 1, // Allow the text container to use the remaining space
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
  },
});

export default CarbonFootprintMain;
