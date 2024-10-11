// screens/DashboardScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Alert, Button, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import { supabase } from '../lib/supabase';
import BottomTabNavigator from '../components/BottomTabNavigator';
import Animated, { Easing } from 'react-native-reanimated'; // Importing reanimated
import * as Animatable from 'react-native-animatable'; // Importing animatable

const DashboardScreen = () => {
    const navigation = useNavigation();
    const route = useRoute(); 
    const { username } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [carpoolDetails, setCarpoolDetails] = useState(null);

    const handleJoinPrivateCarpool = async () => {
        if (!password) {
            Alert.alert('Error', 'Please enter a password.');
            return;
        }

        const { data: carpool, error } = await supabase
            .from('CreateCarpool')
            .select('*')
            .eq('id', password)
            .eq('is_private', true);

        if (error || carpool.length === 0) {
            Alert.alert('Error', 'Invalid password or no private carpool found.');
            return;
        }

        setCarpoolDetails(carpool[0]);
    };

    const handleConfirmBooking = async () => {
        const { error } = await supabase
            .from('CarpoolMembers')
            .insert({
                carpool_id: carpoolDetails.id,
                member_username: username,
            });

        if (error) {
            Alert.alert('Error', 'Failed to confirm booking. Please try again.');
            return;
        }

        Alert.alert('Success', 'You have successfully joined the private carpool!');
        setCarpoolDetails(null);
        setModalVisible(false);
    };

    return (
        <View style={tw`bg-white h-full`}>
            <Animatable.View 
                style={tw`p-5`} 
            >
                <Image 
                    style={{
                        width: 100,
                        height: 100,
                        resizeMode: "contain"
                    }}
                    source={require('../assets/Logo.png')}
                />
            </Animatable.View>

            <View style={styles.container}>
                <Animatable.Image
                    style={{ width: 120, height: 120, resizeMode: "contain" }}
                    source={require('../assets/join.png')}
                    animation="bounceIn" 
                    duration={1500}
                />
                <Animatable.Text 
                    style={styles.title} 
                    animation="fadeIn" 
                    duration={1000}
                >
                    Dashboard
                </Animatable.Text>
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('UserCarpoolGroups', { username })}
                >
                    <Text style={styles.buttonText}>Your Carpools</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('JoinedCarpoolGroups', { username })}
                >
                    <Text style={styles.buttonText}>Joined Carpools</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('UserVehicles', { username })}
                >
                    <Text style={styles.buttonText}>Your Vehicle</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.buttonText}>Join Private Carpool</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Animatable.View 
                        style={styles.modalView} 
                        animation="slideInUp" 
                        duration={500}
                    >
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
                    </Animatable.View>
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
        transition: 'background-color 0.3s',
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
