// ConnectivityTest.js
import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { supabase } from '../../lib/supabase'; // Adjust the path as necessary

const ConnectivityTest = () => {
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Perform a simple select to check connectivity
        const { data, error } = await supabase
          .from('Review')
          .select('*')
          .limit(1);

        if (error) {
          throw error;
        }

        if (data.length > 0) {
          Alert.alert('Success', 'Supabase is reachable!');
        } else {
          Alert.alert('Success', 'Supabase is reachable, but no reviews found.');
        }
      } catch (error) {
        console.error('Connectivity Test Error:', error);
        Alert.alert('Error', 'Failed to connect to Supabase.');
      }
    };

    testConnection();
  }, []);

  return (
    <View>
      <Text>Connectivity Test</Text>
    </View>
  );
};

export default ConnectivityTest;
