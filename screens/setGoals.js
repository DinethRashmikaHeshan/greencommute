import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase"; // Import your Supabase client
import { useNavigation } from "@react-navigation/native";

const SetGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGoals = async () => {
      const userId = 1; // Assuming logged-in user ID is 1 for testing
      const { data, error } = await supabase
        .from("Goals")
        .select("*")
        .eq("user_id", userId); // Fetch all goals for the user

      if (error) {
        setError(error.message);
      } else {
        setGoals(data); // Set the fetched goals
      }
      setLoading(false);
    };

    fetchGoals();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.goalContainer}
      onPress={() => navigation.navigate("GoalDetails", { goalId: item.id })}
    >
      <Text style={styles.goalText}>Target CO2: {item.target_co2} kg</Text>
      <Text style={styles.goalText}>
        Completion Date: {new Date(item.completion_date).toLocaleDateString()}
      </Text>
      <Text style={styles.goalText}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" />; // Loading spinner
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>; // Display error
  }

  return (
    <FlatList
      data={goals}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()} // Use the goal ID as the key
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
  goalContainer: {
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
  goalText: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default SetGoals;
