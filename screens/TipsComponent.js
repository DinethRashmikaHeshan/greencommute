import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TipsComponent = ({ result }) => {
  const resultNum = parseFloat(result);

  // Categorize emissions based on the given thresholds
  let category = "";
  if (resultNum <= 2) {
    category = "low";
  } else if (resultNum <= 6) {
    category = "average";
  } else {
    category = "high";
  }

  // Get the background color based on the category
  const backgroundColor =
    category === "low"
      ? "#DFF5E1" // Light green for low emissions
      : category === "average"
      ? "#FFF8E1" // Light yellow for average emissions
      : "#FDEDEC"; // Light red for high emissions

  // Define the tips based on the category
  const tips =
    category === "low"
      ? [
          "🌱 Keep up eco-driving",
          "🚗 Maintain your vehicle",
          "🚶‍♂️ Try cycling or walking",
          "🚍 Use public transport more",
        ]
      : category === "average"
      ? [
          "🤝 Carpool to reduce emissions",
          "⛽ Optimize fuel efficiency",
          "🚗 Consider hybrid vehicles",
          "🛑 Limit unnecessary trips",
        ]
      : [
          "🚆 Shift to public transport",
          "✈️ Reduce long-distance travel",
          "⚡ Opt for electric vehicles",
          "🚴‍♂️ Try alternative commuting options",
        ];

  return (
    <View style={[styles.tipsContainer, { backgroundColor }]}>
      <Text style={styles.title}>Eco-Friendly Tips</Text>
      {tips.map((tip, index) => (
        <Text key={index} style={styles.tipItem}>
          • {tip}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tipsContainer: {
    borderRadius: 15, // Rounded corners
    padding: 20,
    marginTop: 15,
    marginBottom: 20,
    elevation: 3, // Adds shadow for Android
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2E7D32", // Green text for the title
  },
  tipItem: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000", // Black text for tips
  },
});

export default TipsComponent;
