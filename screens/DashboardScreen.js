// screens/DashboardScreen.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation , useRoute} from '@react-navigation/native';

const DashboardScreen = () => {
    const navigation = useNavigation();
    const route = useRoute(); // Use useRoute to access navigation params
    const { username } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard  { username }</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserCarpoolGroups', { username })}>
                <Text style={styles.buttonText}>Your Carpools</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('JoinedCarpoolGroups', { username })}>
                <Text style={styles.buttonText}>Joined Carpools</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserVehicles', { username })}>
                <Text style={styles.buttonText}>Your Vehicle</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
});

export default DashboardScreen;
