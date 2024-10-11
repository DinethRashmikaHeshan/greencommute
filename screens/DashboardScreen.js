// screens/DashboardScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Alert, Button, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import { supabase } from '../lib/supabase'; // Import Supabase instance
import BottomTabNavigator from '../components/BottomTabNavigator';


const DashboardScreen = () => {
    const navigation = useNavigation();
    const route = useRoute(); 
    const { username } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [carpoolDetails, setCarpoolDetails] = useState(null); // State to store carpool details

    const handleJoinPrivateCarpool = async () => {
        if (!password) {
            Alert.alert('Error', 'Please enter a password.');
            return;
        }

        // Fetch carpool group by ID (password)
        const { data: carpool, error } = await supabase
            .from('CreateCarpool')
            .select('*')
            .eq('id', password) // Check if the entered password matches a carpool group ID
            .eq('is_private', true) // Ensure it's a private group

        if (error || carpool.length === 0) {
            Alert.alert('Error', 'Invalid password or no private carpool found.');
            return;
        }

        // If a valid private carpool group is found, update the state
        setCarpoolDetails(carpool[0]);
    };

    const handleConfirmBooking = async () => {
        // Confirm booking logic here (e.g., save the booking in the database)

        const { error } = await supabase
      .from('CarpoolMembers')
      .insert({
        carpool_id: carpoolDetails.id, // The carpool group ID
        member_username: username, // Replace with the actual user joining (e.g., from auth)
      });

    if (error) {
      Alert.alert('Error', 'Failed to confirm booking. Please try again.');
      return;
    }
        
        // Reset states and close modal after booking
        Alert.alert('Success', 'You have successfully joined the private carpool!');
        setCarpoolDetails(null);
        setModalVisible(false);
    };

    return (
        <View style={tw`bg-white h-full`}>
            <View style={tw`p-5`}>
                <Image 
                    style={{
                        width: 100,
                        height: 100,
                        resizeMode: "contain"
                    }}
                    source={require('../assets/Logo.png')}
                />
            </View>

            <View style={styles.container}>
                <Image
                    style={{ width: 120, height: 120, resizeMode: "contain" }}
                    source={require('../assets/join.png')}
                />
                <Text style={styles.title}>Dashboard</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserCarpoolGroups', { username })}>
                    <Text style={styles.buttonText}>Your Carpools</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('JoinedCarpoolGroups', { username })}>
                    <Text style={styles.buttonText}>Joined Carpools</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserVehicles', { username })}>
                    <Text style={styles.buttonText}>Your Vehicle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Join Private Carpool</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for entering password */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={tw`text-lg font-bold mb-4`}>Enter Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Carpool Password"
                            value={password}
                            onChangeText={setPassword}
                            keyboardType="numeric"
                        />
                        <Button title="Join" onPress={handleJoinPrivateCarpool} color="#009688" />

                        {carpoolDetails && (
                            <>
                                <Text style={tw`mt-4 text-center font-semibold`}>Carpool Details</Text>
                                <Text style={tw`text-gray-700 `}>Group: {carpoolDetails.group_name}</Text>
                                <Text style={tw`text-gray-700`}>Seats Available: {carpoolDetails.seats}</Text>
                                <Text style={tw`text-gray-700`}>Start: {carpoolDetails.origin}</Text>
                                <Text style={tw`text-gray-700`}>Destination: {carpoolDetails.destination}</Text>
                                <Text style={tw`text-gray-700`}>Time: {new Date(carpoolDetails.schedule_time).toLocaleString()}</Text>
                                <Button title="Confirm Booking" onPress={handleConfirmBooking} color="#009688" />
                            </>
                        )}

                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <BottomTabNavigator username={username}/>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'top',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#009688',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: '100%',
        marginBottom: 20,
    },
    cancelButton: {
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#FF3B30',
        fontWeight: 'bold',
    },
});

export default DashboardScreen;
