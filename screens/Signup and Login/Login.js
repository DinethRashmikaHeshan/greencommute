import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { TextInput, Button, Snackbar } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import icons from Material Icons

const bgImage = require("../../assets/background-image.jpeg");

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [userDetails, setUserDetails] = useState({
    id: "",
  });

  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    setSnackbarMessage(""); // Reset snackbar message

    // Validate inputs
    if (!username || !password) {
      setSnackbarMessage("Username and password are required.");
      setSnackbarVisible(true);
      setLoading(false);
      return;
    }

    // Fetch user data from the users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    setUserDetails(user);

    if (userError || !user) {
      setSnackbarMessage("Username or password is incorrect.");
      setSnackbarVisible(true);
      setLoading(false);
      return;
    }

    // Check if the user's 'amountToPay' is greater than 300
    if (user.amountToPay > 300) {
      setSnackbarMessage("Please Pay Due.");
      setSnackbarVisible(true);
      setLoading(false);
      return;
    }

    // Compare the input password with the stored plain text password
    if (password !== user.password) {
      setSnackbarMessage("Username or password is incorrect.");
      setSnackbarVisible(true);
      setLoading(false);
      return;
    }

    // If login is successful, clear input fields and navigate to the Home screen
    setUsername("");
    setPassword("");
    navigation.navigate("HomeScreen", { username, uid: user.id });
    setSnackbarMessage("Logged in successfully!");
    setSnackbarVisible(true);
    setLoading(false);
  };

  return (
    <ImageBackground
      source={bgImage} // Path to your background image
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.loginBox}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Log in to continue</Text>
        <View style={styles.inputContainer}>
          <Icon name="person" size={24} color="#2E7D32" style={styles.icon} />
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            theme={{ colors: { primary: "#2E7D32" } }} // Green label color for better visibility
            underlineColor="transparent"
            mode="flat"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#2E7D32" style={styles.icon} />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            theme={{ colors: { primary: "#2E7D32" } }}
            underlineColor="transparent"
            mode="flat"
          />
        </View>
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Log In
        </Button>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  backgroundImage: {
    opacity: 0.9, // Adjust the opacity for better text visibility
  },
  loginBox: {
    padding: 20,
    marginHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly transparent background to highlight the form
    borderRadius: 15,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32", // Match your app's green theme
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#F0F4F8", // Light background for input fields
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "transparent", // Make input background transparent to blend with container
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: "#2E7D32", // Dark green for the button
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
  },
});

export default Login;
