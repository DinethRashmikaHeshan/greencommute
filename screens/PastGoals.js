import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import { FontAwesome } from "@expo/vector-icons"; // Import icons

const PastGoals = ({ route, navigation }) => {
  const { uid } = route.params; // Get uid from route params
  const [pastGoals, setPastGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastGoals = async () => {
      try {
        const { data, error } = await supabase
          .from("Goals")
          .select("*")
          .eq("user_id", uid)
          .neq("status", "active"); // Fetch only past goals

        if (error) {
          throw error;
        }

        setPastGoals(data || []);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPastGoals();
  }, [uid]);

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeading}>Your Success Story</Text>
      <Text style={styles.subHeading}>A Record of Past Goals</Text>

      {pastGoals.length === 0 ? (
        <Text style={styles.noGoalsText}>No past goals found.</Text>
      ) : (
        <ScrollView>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Goal Name</Text>
              <Text style={styles.tableHeaderText}>Target CO2 (kg)</Text>
              <Text style={styles.tableHeaderText}>Completion Date</Text>
              <Text style={styles.tableHeaderText}>Status</Text>
            </View>
            {pastGoals.map((goal) => (
              <View
                key={goal.id}
                style={[
                  styles.tableRow,
                  goal.status === "completed"
                    ? styles.completedRow
                    : goal.status === "failed"
                    ? styles.failedRow
                    : {},
                ]}
              >
                {goal.status === "completed" ? (
                  <FontAwesome name="check" size={20} color="#4CAF50" /> // Check mark for completed
                ) : (
                  <FontAwesome name="times" size={20} color="#F44336" /> // Cross for failed
                )}
                <Text style={styles.tableCell}>{goal.goal_name}</Text>
                <Text style={styles.tableCell}>{goal.target_co2} kg</Text>
                <Text style={styles.tableCell}>
                  {new Date(goal.completion_date).toLocaleDateString()}
                </Text>
                <Text style={styles.tableCell}>{goal.status}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFF5E1",
    padding: 20,
  },
  mainHeading: {
    fontSize: 28, // Larger font size for main heading
    fontWeight: "bold", // Bold for emphasis
    textAlign: "center", // Centered alignment
    marginBottom: 10, // Space below the heading
    color: "#2E7D32", // Matching green color for consistency
  },
  subHeading: {
    fontSize: 16, // Slightly smaller than the main heading
    fontWeight: "600", // Semi-bold for distinction
    textAlign: "center", // Centered alignment
    color: "#555", // A contrasting color for the subheading
    marginBottom: 20, // Space below the subheading
  },
  noGoalsText: {
    fontSize: 18,
    color: "#555",
    marginTop: 20,
    textAlign: "center", // Center align the no goals message
  },
  table: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
    paddingBottom: 10, // Added padding for better appearance
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2E7D32", // Darker green for header
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    padding: 10,
    alignItems: "center", // Center align items vertically
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  completedRow: {
    backgroundColor: "#D4EDDA", // Light green for completed goals
  },
  failedRow: {
    backgroundColor: "#F8D7DA", // Light red for failed goals
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  backButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default PastGoals;
