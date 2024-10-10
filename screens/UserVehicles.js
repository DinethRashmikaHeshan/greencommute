import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, Alert, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import tw from 'tailwind-react-native-classnames';
import { useRoute } from '@react-navigation/native';

const UserVehicles = () => {
  const route = useRoute();
  const { username } = route.params;
  const [vehicles, setVehicles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Store selected vehicle for update
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [fuelConsumption, setFuelConsumption] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const vehicleTypes = ['Mini - Car', 'Car', 'Van'];

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from('Vehicles')
      .select('*')
      .eq('owner_name', username);

    if (error) {
      console.error('Error fetching vehicles:', error);
      return;
    }

    setVehicles(data);
  };

  const handleAddOrUpdateVehicle = async () => {
    // Validate input
    if (!vehicleNumber || !vehicleType || !fuelConsumption) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (editMode && selectedVehicle) {
      // Update vehicle
      const { error } = await supabase
        .from('Vehicles')
        .update({ vehicle_number: vehicleNumber, vehicle_type: vehicleType, fuel_consumption: fuelConsumption })
        .eq('id', selectedVehicle.id);

      if (error) {
        console.error('Error updating vehicle:', error);
        Alert.alert('Error', 'Failed to update vehicle.');
        return;
      }

      Alert.alert('Success', 'Vehicle updated successfully!');
    } else {
      // Add vehicle
      const { error } = await supabase
        .from('Vehicles')
        .insert([{ vehicle_number: vehicleNumber, vehicle_type: vehicleType, owner_name: username, fuel_consumption: fuelConsumption }]);

      if (error) {
        console.error('Error adding vehicle:', error);
        Alert.alert('Error', 'Failed to add vehicle.');
        return;
      }

      Alert.alert('Success', 'Vehicle added successfully!');
    }

    clearInputs();
    setModalVisible(false);
    fetchVehicles(); // Refresh the list of vehicles
  };

  const handleDeleteVehicle = async (id) => {
    // First check if the vehicle is referenced in CreateCarpool
    const { data, error } = await supabase
      .from('CreateCarpool')
      .select('*')
      .eq('vehicle_id', id);

    if (data.length > 0) {
      Alert.alert('Error', 'This vehicle cannot be deleted as it is referenced in carpool records.');
      return;
    }

    const { error: deleteError } = await supabase
      .from('Vehicles')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting vehicle:', deleteError);
      Alert.alert('Error', 'Failed to delete vehicle.');
      return;
    }

    Alert.alert('Success', 'Vehicle deleted successfully!');
    fetchVehicles(); // Refresh the list of vehicles
  };

  const clearInputs = () => {
    setVehicleNumber('');
    setVehicleType('');
    setFuelConsumption('');
    setShowDropdown(false);
    setEditMode(false);
    setSelectedVehicle(null);
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleNumber(vehicle.vehicle_number);
    setVehicleType(vehicle.vehicle_type);
    setFuelConsumption(vehicle.fuel_consumption);
    setEditMode(true);
    setModalVisible(true);
  };

  return (
    <View style={tw`flex-1 p-5 bg-gray-50`}>
      <Text style={tw`text-3xl font-bold mb-4 text-center text-blue-600`}>Your Vehicles</Text>

      <Button title="Add a New Vehicle" onPress={() => {
        clearInputs();
        setModalVisible(true);
      }} color="#4CAF50" />

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.vehicleCard}>
            <Text style={tw`text-lg font-bold mb-1`}>Vehicle Number: {item.vehicle_number}</Text>
            <Text style={tw`text-gray-700`}>Vehicle Type: {item.vehicle_type}</Text>
            <Text style={tw`text-gray-700`}>Owner: {item.owner_name}</Text>
            <Text style={tw`text-gray-700`}>Fuel Consumption: {item.fuel_consumption} L/100km</Text>
            <View style={tw`flex-row justify-between mt-2`}>
              <Button title="Edit" onPress={() => handleEditVehicle(item)} />
              <Button title="Delete" onPress={() => handleDeleteVehicle(item.id)} color="red" />
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }} // Add bottom padding
      />

      {/* Add/Edit Vehicle Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          clearInputs();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={tw`text-lg font-bold mb-2 text-center`}>{editMode ? 'Edit Vehicle' : 'Add a New Vehicle'}</Text>
            <TextInput
              placeholder="Vehicle Number"
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() => setShowDropdown(!showDropdown)}
              style={styles.dropdown}
            >
              <Text style={tw`text-gray-600`}>{vehicleType || "Select Vehicle Type"}</Text>
            </TouchableOpacity>
            {showDropdown && (
              <View style={styles.dropdownList}>
                {vehicleTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      setVehicleType(type);
                      setShowDropdown(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TextInput
              placeholder="Fuel Consumption (L/100km)"
              value={fuelConsumption}
              onChangeText={setFuelConsumption}
              style={styles.input}
              keyboardType="numeric"
            />
            <Button title={editMode ? "Update Vehicle" : "Add Vehicle"} onPress={handleAddOrUpdateVehicle} color="#2196F3" />
            <Button title="Cancel" onPress={() => {
              setModalVisible(false);
              clearInputs();
            }} color="#FF3B30" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    position: 'absolute',
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    marginTop: 50,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default UserVehicles;
