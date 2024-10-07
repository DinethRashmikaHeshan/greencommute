import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const ViewSavings = () => {
  // Dummy data for carbon savings
  const savingsData = [
    { date: "2024-09-01", savings: "1.2 kg" },
    { date: "2024-09-02", savings: "1.5 kg" },
    { date: "2024-09-03", savings: "1.3 kg" },
    // Add more data as needed
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Carbon Savings</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {savingsData.map((item, index) => (
          <View key={index} style={styles.savingsCard}>
            <Text style={styles.savingsDate}>{item.date}</Text>
            <Text style={styles.savingsAmount}>{item.savings}</Text>
          </View>
        ))}
      </ScrollView>
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  savingsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  savingsDate: {
    fontSize: 16,
    fontWeight: "bold",
  },
  savingsAmount: {
    fontSize: 16,
    color: "#2E7D32", // Green color for positive impact
  },
});

export default ViewSavings;
