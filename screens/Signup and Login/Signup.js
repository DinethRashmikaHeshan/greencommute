import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { supabase } from '../../lib/supabase'; 
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons from Material Icons

const bgImage = require('../../assets/background-image.jpeg');

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      setSnackbarMessage('All fields are required.');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);

    const { error: userError } = await supabase
      .from('users') 
      .insert([{ username, email, password }]);

    if (userError) {
      console.error('Error saving user data:', userError);
      setLoading(false);
      setSnackbarMessage('Error creating account.');
      setSnackbarVisible(true);
      return;
    }

    setUsername('');
    setEmail('');
    setPassword('');
    setSnackbarMessage('Account created successfully!');
    setSnackbarVisible(true);
    setLoading(false);
    navigation.navigate('Login'); 
  };

  return (
    <ImageBackground 
      source={bgImage} // Path to your background image
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputContainer}>
        <Icon name="person" size={24} color="#2c3e50" style={styles.icon} />
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          theme={{ colors: { primary: '#2c3e50' } }} // Change label color for better visibility
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="email" size={24} color="#2c3e50" style={styles.icon} />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          theme={{ colors: { primary: '#2c3e50' } }} 
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} color="#2c3e50" style={styles.icon} />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          theme={{ colors: { primary: '#2c3e50' } }} 
        />
      </View>
      <Button mode="contained" onPress={handleSignUp} loading={loading} disabled={loading} style={styles.button}>
        Sign Up
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('Login')} labelStyle={styles.loginButton}>
        Go to Login
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backgroundImage: {
    opacity: 0.8, // Adjust the opacity for better text visibility
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#d5f4e6', // Light green background for input fields
    borderRadius: 5,
    padding: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#2c3e50', // Input text color
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#2ecc71', // Green color for the button
  },
  loginButton: {
    color: '#2c3e50', // Text color for the login button
  },
});

export default SignUp;
