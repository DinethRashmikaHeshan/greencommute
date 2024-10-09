import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ProgressBarAndroid,
} from "react-native";
import { supabase } from "../lib/supabase"; // Import Supabase client

const GoalDetails = ({ route }) => {
  const { goalId } = route.params; // Get the goalId passed from the navigation
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCO2Saved, setCurrentCO2Saved] = useState(0); // Assume this is tracked elsewhere

  useEffect(() => {
    const fetchGoal = async () => {
      const { data, error } = await supabase
        .from("Goals")
        .select("*")
        .eq("id", goalId) // Fetch goal by ID
        .single();

      if (error) {
        setError(error.message);
      } else {
        setGoal(data); // Set the fetched goal data
      }
      setLoading(false);
    };

    fetchGoal();
  }, [goalId]);

  const calculateProgress = () => {
    const goalValue = parseFloat(goal?.target_co2 || 0); // Get the target CO2 from fetched goal
    if (goalValue > 0) {
      return (currentCO2Saved / goalValue) * 100; // Calculate percentage
    }
    return 0;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" />; // Loading spinner
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>; // Display error
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goal Details</Text>
      <Text style={styles.goalText}>Target CO2: {goal.target_co2} kg</Text>
      <Text style={styles.goalText}>
        Completion Date: {new Date(goal.completion_date).toLocaleDateString()}
      </Text>
      <Text style={styles.goalText}>Status: {goal.status}</Text>
      <Text style={styles.progressText}>
        Progress: {calculateProgress().toFixed(2)}%
      </Text>
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={calculateProgress() / 100} // Normalize the value to [0,1]
        color="#2E7D32" // Green color for the progress bar
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFF5E1",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  goalText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default GoalDetails;
