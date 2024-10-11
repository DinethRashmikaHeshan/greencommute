import React, { useState } from "react";
import { Snackbar } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import icons from Material Icons
import { TextInput, Button } from "react-native-paper";

const bgImage = require("../../assets/background-image.jpeg");

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      setSnackbarMessage("All fields are required.");
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);

    const { error: userError } = await supabase
      .from("users")
      .insert([{ username, email, password }]);

    if (userError) {
      console.error("Error saving user data:", userError);
      setLoading(false);
      setSnackbarMessage("Error creating account.");
      setSnackbarVisible(true);
      return;
    }

    setUsername("");
    setEmail("");
    setPassword("");
    setSnackbarMessage("Account created successfully!");
    setSnackbarVisible(true);
    setLoading(false);
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={bgImage} // Path to your background image
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.signupBox}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us and start your journey</Text>

        <View style={styles.inputContainer}>
          <Icon name="person" size={24} color="#2E7D32" style={styles.icon} />
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            theme={{ colors: { primary: "#2E7D32" } }}
            underlineColor="transparent"
            mode="flat"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="email" size={24} color="#2E7D32" style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            theme={{ colors: { primary: "#2E7D32" } }}
            underlineColor="transparent"
            mode="flat"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#2E7D32" style={styles.icon} />
          <TextInput
            placeholder="Password"
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
          onPress={handleSignUp}
          loading={loading}
          disabled={loading}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Sign Up
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate("Login")}
          labelStyle={styles.loginButton}
        >
          Go to Login
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
  signupBox: {
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
    color: "#2E7D32",
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
    backgroundColor: "#2E7D32",
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
  },
  loginButton: {
    color: "#2E7D32",
    textAlign: "center",
    marginTop: 10,
  },
});

export default SignUp;
