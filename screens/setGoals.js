import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // For selecting completion date
import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/native";

const SetGoals = ({ route }) => {
  const { uid, username } = route.params; // Get uid and username from route params
  const [activeGoal, setActiveGoal] = useState(null);
  const [goalName, setGoalName] = useState("");
  const [targetCO2, setTargetCO2] = useState("");
  const [completionDate, setCompletionDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [progress, setProgress] = useState(0); // Track progress percentage
  const [completedGoals, setCompletedGoals] = useState(0); // Count of completed goals
  const navigation = useNavigation(); // Use navigation from useNavigation hook

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        // Fetch active goal for the user
        const { data: activeGoalData, error: activeGoalError } = await supabase
          .from("Goals")
          .select("*")
          .eq("user_id", uid)
          .eq("status", "active")
          .single();

        // Set active goal state
        setActiveGoal(activeGoalData || null); // If no active goal, set to null

        // Fetch completed goals count
        const { data: completedGoalsData, error: completedGoalsError } =
          await supabase
            .from("Goals")
            .select("id")
            .eq("user_id", uid)
            .eq("status", "completed");

        setCompletedGoals(completedGoalsData?.length || 0);

        // If there's an active goal, initialize the fields
        if (activeGoalData) {
          setGoalName(activeGoalData.goal_name || ""); // Check for existence
          setTargetCO2(
            activeGoalData.target_co2
              ? activeGoalData.target_co2.toString()
              : ""
          ); // Check for existence
          setCompletionDate(new Date(activeGoalData.completion_date));

          // Calculate the progress when the active goal is fetched
          await calculateProgress(activeGoalData); // Await the calculation to ensure it's completed
        }
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [uid]);

  const calculateProgress = async (goal) => {
    try {
      const { data: carpools, error: carpoolsError } = await supabase
        .from("user_carpool")
        .select("carpool_id")
        .eq("user_id", uid);

      if (carpoolsError) throw carpoolsError;

      if (!carpools || carpools.length === 0) {
        console.log("No carpools found for this user.");
        return;
      }

      const carpoolIds = carpools.map((carpool) => carpool.carpool_id);
      const { data: carpoolDetails, error: carpoolDetailsError } =
        await supabase
          .from("CreateCarpool")
          .select("distance, created_at")
          .in("id", carpoolIds);

      if (carpoolDetailsError) throw carpoolDetailsError;

      let totalDistanceMiles = 0;
      const co2PerLiterGasoline = 2.31; // kg CO2 per liter
      const fuelConsumption = 12; // Average fuel consumption in liters per 100 km

      const distanceToCO2 = (distanceInMiles) => {
        const distanceInKilometers = distanceInMiles * 1.60934; // Convert miles to km
        return (
          (distanceInKilometers / 100) * fuelConsumption * co2PerLiterGasoline
        );
      };

      carpoolDetails.forEach((carpool) => {
        const carpoolCreatedDate = new Date(carpool.created_at);
        const goalCreatedDate = new Date(goal.created_at);
        if (carpoolCreatedDate >= goalCreatedDate) {
          totalDistanceMiles += carpool.distance; // Distance is in miles
          console.log(`Added distance: ${carpool.distance} miles`);
        }
      });

      const totalCO2 = distanceToCO2(totalDistanceMiles);
      console.log(`Total Distance: ${totalDistanceMiles} miles`);
      console.log(`Total CO2 Emissions: ${totalCO2} kg`);

      // Calculate progress
      const targetCO2Value = parseFloat(goal.target_co2);
      if (targetCO2Value > 0) {
        const progressPercentage = (totalCO2 / targetCO2Value) * 100;
        setProgress(progressPercentage);
        console.log(`Progress: ${progressPercentage.toFixed(2)}%`);

        // If progress reaches or exceeds 100%, mark the goal as completed
        if (progressPercentage >= 100) {
          await markGoalAsCompleted(goal.id);
          setActiveGoal(null); // Clear the active goal and show the option to create a new one
          Alert.alert("Congratulations!", "You have completed your goal.");
        }
      }
    } catch (error) {
      console.error("Error calculating progress:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  // Function to mark the goal as completed
  const markGoalAsCompleted = async (goalId) => {
    try {
      const { error } = await supabase
        .from("Goals")
        .update({ status: "completed" }) // Mark the goal as completed
        .eq("id", goalId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating goal status:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteGoal = async () => {
    try {
      const { error } = await supabase
        .from("Goals")
        .delete() // Delete the goal entirely
        .eq("id", activeGoal.id);

      if (error) {
        throw error;
      }

      // Clear fields and state
      setActiveGoal(null);
      setGoalName("");
      setTargetCO2("");
      setCompletionDate(new Date());
      Alert.alert("Success", "Goal deleted successfully.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSetNewGoal = async () => {
    if (!goalName || !targetCO2) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const { error } = await supabase.from("Goals").insert({
        user_id: uid,
        goal_name: goalName,
        target_co2: parseFloat(targetCO2), // Ensure it's stored as float8
        completion_date: completionDate,
        status: "active",
      });

      if (error) {
        throw error;
      }

      Alert.alert("Success", "New goal set successfully!");
      // Reset input fields after setting a new goal
      setGoalName("");
      setTargetCO2("");
      setCompletionDate(new Date());
      setActiveGoal({
        goal_name: goalName,
        target_co2: parseFloat(targetCO2), // Ensure it's stored as float8
        completion_date: completionDate,
        status: "active",
      });
      // Reset progress to 0 for the new goal
      setProgress(0);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleUpdateGoal = async () => {
    if (!goalName || !targetCO2) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const { error } = await supabase
        .from("Goals")
        .update({
          goal_name: goalName,
          target_co2: parseFloat(targetCO2), // Ensure it's stored as float8
          completion_date: completionDate,
        })
        .eq("id", activeGoal.id);

      if (error) {
        throw error;
      }

      Alert.alert("Success", "Goal updated successfully!");
      setIsEditing(false); // Exit editing mode
      // Update the active goal state
      setActiveGoal((prev) => ({
        ...prev,
        goal_name: goalName,
        target_co2: parseFloat(targetCO2),
        completion_date: completionDate,
      }));
      calculateProgress(activeGoal); // Recalculate progress
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleViewPastGoals = () => {
    navigation.navigate("PastGoals", { uid, username }); // Pass uid and username
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || completionDate;
    setShowDatePicker(false);
    setCompletionDate(currentDate);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.mainHeading}>
          Make a Difference: Set Your Goals!
        </Text>
        <Text style={styles.subHeading}>
          Join the movement towards a sustainable future by tracking your carbon
          reduction efforts.
        </Text>
      </View>

      {activeGoal ? (
        <View>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter Goal Name"
                value={goalName}
                onChangeText={setGoalName}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Target CO2 Reduction (kg)"
                keyboardType="numeric"
                value={targetCO2}
                onChangeText={setTargetCO2}
              />
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
              >
                <Text style={styles.dateText}>
                  Completion Date: {completionDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={completionDate}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
              <TouchableOpacity
                style={styles.newGoalButton}
                onPress={handleUpdateGoal}
              >
                <Text style={styles.buttonText}>Update Goal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.goalContainer}>
                <Text style={styles.goalTitle}>{activeGoal.goal_name}</Text>
                <Text style={styles.goalText}>
                  Target CO2: {activeGoal.target_co2} kg
                </Text>
                <Text style={styles.goalText}>
                  Completion Date:{" "}
                  {new Date(activeGoal.completion_date).toLocaleDateString()}
                </Text>
                <Text style={styles.goalText}>Status: {activeGoal.status}</Text>

                {/* Buttons for Edit and Delete */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteGoal}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    Progress: {progress.toFixed(2)}%
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={{
                        ...styles.progressFill,
                        width: `${progress}%`,
                      }}
                    />
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.noGoalText}>No active goal found.</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Goal Name"
            value={goalName}
            onChangeText={setGoalName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Target CO2 Reduction (kg)"
            keyboardType="numeric"
            value={targetCO2}
            onChangeText={setTargetCO2}
          />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text style={styles.dateText}>
              Completion Date: {completionDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={completionDate}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          <TouchableOpacity
            style={styles.newGoalButton}
            onPress={handleSetNewGoal}
          >
            <Text style={styles.buttonText}>Set New Goal</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Congratulations message */}
      {completedGoals > 0 && (
        <Text style={styles.congratulationsText}>
          🎉 Hooray! 🎉{"\n"}You’ve successfully completed {completedGoals}{" "}
          {completedGoals === 1 ? "goal" : "goals"}!
        </Text>
      )}

      {/* Button to view past goals */}
      <TouchableOpacity
        style={styles.pastGoalsButton}
        onPress={handleViewPastGoals}
      >
        <Text style={styles.buttonText}>See Past Goals</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
    alignItems: "center", // Center align the header elements
  },
  mainHeading: {
    fontSize: 24, // Bigger font size for main heading
    fontWeight: "bold", // Bold font weight
    textAlign: "center", // Center align
    color: "#2E7D32", // Matching green color
  },
  subHeading: {
    fontSize: 12,
    fontWeight: "600", // Semi bold font weight
    color: "#555", // A slightly darker color for contrast
    textAlign: "center", // Center align
    marginTop: 5, // Add some space between title and subheading
  },

  container: {
    flex: 1,
    backgroundColor: "#DFF5E1",
    padding: 20,
  },
  goalContainer: {
    backgroundColor: "#B2E5B0", // Light green background for goal details and progress
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center", // Center the text
    color: "#2E7D32", // Highlighting color for the goal name
    fontFamily: "Roboto-Bold", // Use a nice font (ensure you have this font loaded)
  },
  goalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "left", // Center the text
    color: "#333", // Match the font color
    fontFamily: "Roboto-Regular", // Use a matching regular font (ensure you have this font loaded)
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  progressContainer: {
    marginVertical: 20,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2E7D32", // Matching color for progress text
  },
  progressBar: {
    height: 20,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2E7D32", // Green color for progress fill
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: "#FFD700", // Gold color for edit button
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#FF4500", // Red color for delete button
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
  },
  newGoalButton: {
    backgroundColor: "#2E7D32", // Green color for new goal button
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  pastGoalsButton: {
    backgroundColor: "#4CAF50", // Updated green color for past goals button
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  noGoalText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  congratulationsText: {
    fontSize: 18,
    color: "#2E7D32",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: "#B0BEC5", // Gray color for cancel button
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
});

export default SetGoals;
