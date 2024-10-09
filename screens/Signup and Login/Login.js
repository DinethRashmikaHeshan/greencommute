import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase'; // Adjust the import based on your project structure
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    setError(''); // Reset error state

    // Validate inputs
    if (!username || !password) {
      setError('Username and password are required.');
      setLoading(false);
      return;
    }

    // Fetch user data from the users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single(); // Ensure only one user with that username

    if (userError || !user) {
      setError('Username or password is incorrect.');
      setLoading(false);
      return;
    }

    // Compare the input password with the stored plain text password
    if (password !== user.password) {
      setError('Username or password is incorrect.');
      setLoading(false);
      return;
    }

    // If login is successful, clear input fields and navigate to the Rating screen
    Alert.alert('Success', 'Logged in successfully!');
    setUsername(''); // Clear username field
    setPassword(''); // Clear password field
    navigation.navigate('HomeScreen', { username }); // Passing username as param
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={loading ? "Logging In..." : "Login"} onPress={handleLogin} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e9f5ee',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
});

export default Login;
