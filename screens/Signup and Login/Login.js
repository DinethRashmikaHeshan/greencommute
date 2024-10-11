import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper'; 
import { supabase } from '../../lib/supabase'; 
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons from Material Icons

const bgImage = require('../../assets/background-image.jpeg');

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [userDetails, setUserDetails] = useState({
    id: '',
  });

  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    setSnackbarMessage(''); // Reset snackbar message

    // Validate inputs
    if (!username || !password) {
      setSnackbarMessage('Username and password are required.');
      setSnackbarVisible(true);
      setLoading(false);
      return;
    }

    // Fetch user data from the users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single(); 

    setUserDetails(user)  

    if (userError || !user) {
      setSnackbarMessage('Username or password is incorrect.');
      setSnackbarVisible(true);
      setLoading(false);
      return;
    }

    // Check if the user's 'amountToPay' is greater than 300
    if (user.amountToPay > 300) {
      setSnackbarMessage('Please Pay Due.');
      setSnackbarVisible(true);
      setLoading(false);
      return;
    }

    // Compare the input password with the stored plain text password
    if (password !== user.password) {
      setSnackbarMessage('Username or password is incorrect.');
      setSnackbarVisible(true);
      setLoading(false);
      return;
    }

    // If login is successful, clear input fields and navigate to the Rating screen
    setUsername('');
    setPassword('');
    navigation.navigate('HomeScreen', { username ,uid:userDetails.id}); 
    setSnackbarMessage('Logged in successfully!');
    setSnackbarVisible(true);
    setLoading(false);
  };

  return (
    <ImageBackground 
      source={bgImage} // Path to your background image
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <Text style={styles.title}>Login</Text>
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
      <Button mode="contained" onPress={handleLogin} loading={loading} disabled={loading} style={styles.button}>
        Login
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
});

export default Login;
