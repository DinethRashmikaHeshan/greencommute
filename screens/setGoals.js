import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const SetGoals = () => {
  const [goal, setGoal] = useState("");
  const [goalSet, setGoalSet] = useState(false);

  const handleSetGoal = () => {
    if (goal) {
      setGoalSet(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Carbon Reduction Goals</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter target CO2 reduction (kg)"
        keyboardType="numeric"
        value={goal}
        onChangeText={(text) => setGoal(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSetGoal}>
        <Text style={styles.buttonText}>Set Goal</Text>
      </TouchableOpacity>

      {goalSet && (
        <View style={styles.goalContainer}>
          <Text style={styles.goalText}>Goal Set: Reduce CO2 by {goal} kg</Text>
        </View>
      )}
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
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  button: {
    backgroundColor: "#2E7D32", // Green button
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  goalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  goalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
});

export default SetGoals;
