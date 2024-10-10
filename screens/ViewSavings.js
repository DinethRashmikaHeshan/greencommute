import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { supabase } from "../lib/supabase";
import { BarChart } from "react-native-chart-kit"; // Ensure this library is installed

const ViewSavings = ({ route }) => {
  const { uid, username } = route.params; // Get uid from route params
  const [savingsData, setSavingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState("daily"); // Default to daily
  const [totalSavings, setTotalSavings] = useState(0);
  const [treesPlanted, setTreesPlanted] = useState(0);

  useEffect(() => {
    const fetchSavingsData = async () => {
      try {
        const { data, error } = await supabase
          .from("CarpoolMembers")
          .select("carpool_id")
          .eq("member_username", username);

        if (error) throw error;

        const carpools = data.map((carpool) => carpool.carpool_id);

        const { data: carpoolDetails, error: detailsError } = await supabase
          .from("CreateCarpool")
          .select("distance, created_at")
          .in("id", carpools);

        if (detailsError) throw detailsError;

        const savings = carpoolDetails.map((carpool) => {
          const co2Saved = carpool.distance * 0.453592 * 2.31; // Convert distance to kg CO2 saved
          return {
            date: new Date(carpool.created_at), // Parse the date string into a Date object
            distance: carpool.distance,
            savings: co2Saved,
          };
        });

        console.log("Fetched Savings Data:", savings); // Log fetched data
        setSavingsData(savings);

        const total = savings.reduce((acc, curr) => acc + curr.savings, 0);
        setTotalSavings(total);
        const trees = Math.floor(total / ((4.3 * 1000) / 165));
        setTreesPlanted(trees);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavingsData();
  }, [uid]);

  const filterSavingsByTimeFrame = (timeFrame) => {
    let filteredData = [];
    const today = new Date();

    savingsData.forEach((saving) => {
      // Compare saving.date with today based on the selected time frame
      if (
        timeFrame === "daily" &&
        saving.date.toDateString() === today.toDateString()
      ) {
        filteredData.push(saving);
      } else if (
        timeFrame === "weekly" &&
        saving.date >= new Date(today.setDate(today.getDate() - 7))
      ) {
        filteredData.push(saving);
      } else if (
        timeFrame === "monthly" &&
        saving.date >= new Date(today.setMonth(today.getMonth() - 1))
      ) {
        filteredData.push(saving);
      }
    });

    console.log("Filtered Savings Data:", filteredData); // Log the filtered data
    return filteredData;
  };

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const filteredSavingsData = filterSavingsByTimeFrame(timeFrame);
  console.log("Filtered Savings Data:", filteredSavingsData); // Log filtered data

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Carbon Savings</Text>
        <Text style={styles.subtitle}>
          Track your efforts and see the impact!
        </Text>

        {/* Graph Section */}
        <View style={styles.graphContainer}>
          {filteredSavingsData.length > 0 ? (
            <BarChart
              data={{
                labels: filteredSavingsData.map((s) =>
                  s.date.toLocaleDateString()
                ), // Convert date objects to strings
                datasets: [
                  {
                    data: filteredSavingsData.map((s) => s.savings),
                  },
                ],
              }}
              width={Dimensions.get("window").width - 30}
              height={220}
              yAxisLabel="kg"
              chartConfig={{
                backgroundColor: "#F1F8E9", // White background color
                backgroundGradientFrom: "#F1F8E9", // White background color
                backgroundGradientTo: "#F1F8E9", // White background color
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`, // Forest green for the bars
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black for the labels
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#006400", // Dark green for the dot stroke
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          ) : (
            <Text style={styles.noDataText}>
              No data available for this timeframe.
            </Text>
          )}
        </View>

        {/* Timeframe Buttons */}
        <View style={styles.graphContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => handleTimeFrameChange("daily")}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleTimeFrameChange("weekly")}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleTimeFrameChange("monthly")}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Monthly</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cumulative Savings */}
        <View style={styles.cumulativeContainer}>
          <Text style={styles.cumulativeSavings}>
            Total CO2 Savings: {totalSavings.toFixed(2)} kg
          </Text>
          <Text style={styles.treesPlanted}>
            Equivalent to {treesPlanted} trees planted! 🌳
          </Text>
        </View>

        {/* Savings Table */}
        <ScrollView>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Date</Text>
              <Text style={styles.tableHeaderText}>Distance (miles)</Text>
              <Text style={styles.tableHeaderText}>CO2 Saved (kg)</Text>
            </View>
            {savingsData.map((s, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {s.date.toLocaleDateString()}
                </Text>
                <Text style={styles.tableCell}>{s.distance} miles</Text>
                <Text style={styles.tableCell}>{s.savings.toFixed(2)} kg</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: "#DFF5E1",
  },
  container: {
    flex: 1,
    backgroundColor: "#DFF5E1",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2E7D32",
    textShadowColor: "#A8DAB5", // Light shadow color for a soft effect
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600", // Semi bold font weight
    color: "#555", // A slightly darker color for contrast
    textAlign: "center", // Center align
    marginTop: 5, // Add some space between title and subheading
  },
  graphContainer: {
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3, // Shadow effect for better appearance
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  cumulativeContainer: {
    backgroundColor: "#E0F2F1", // Light cyan background for cumulative savings
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2, // Shadow effect
  },
  cumulativeSavings: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  treesPlanted: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F1F8E9", // White background for table
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2E7D32",
    padding: 10,
  },
  tableHeaderText: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "#888",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default ViewSavings;
