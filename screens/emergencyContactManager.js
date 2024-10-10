import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, FlatList, Alert, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import {
  fetchEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  changeActiveContact,
} from './emergencyContactservice';

const EmergencyContactManager = ( {route} ) => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState('');
  const [activeContact, setActiveContact] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState('');
  const [isAddMode, setIsAddMode] = useState(true); // Track if modal is for adding or updating
  const {userId} = route.params;
  
  // const userId = "5f43b03e-1728-4c83-a105-9daad55b3c8b";
  
  useEffect(() => {
    loadContacts();
    console.log(userId);
  }, []);

  const loadContacts = async () => {
    const data = await fetchEmergencyContacts(userId);
    setContacts(data);
    const active = data.find((contact) => contact.is_active);
    setActiveContact(active ? active.id : null);
  };

  // Validation function to ensure 10 digits and starts with '07'
  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^07\d{8}$/;
    return regex.test(phoneNumber);
  };

  const handleAddContact = async () => {
    if (!newContact) {
      Alert.alert('Validation Error', 'Please enter a phone number');
    } else if (!validatePhoneNumber(newContact)) {
      Alert.alert('Validation Error', 'Phone number must start with "07" and be 10 digits long.');
    } else {
      await addEmergencyContact(userId, newContact);
      setNewContact('');
      loadContacts();
      setModalVisible(false);
    }
  };

  const handleOpenModal = (contactId, currentPhoneNumber) => {
    setSelectedContactId(contactId);
    setUpdatedPhoneNumber(currentPhoneNumber || ''); // If adding new contact, leave blank
    setIsAddMode(!contactId); // Toggle between add/update mode
    setModalVisible(true);
  };

  const handleUpdateContact = async () => {
    if (!validatePhoneNumber(updatedPhoneNumber)) {
      Alert.alert('Validation Error', 'Phone number must start with "07" and be 10 digits long.');
    } else {
      await updateEmergencyContact(selectedContactId, updatedPhoneNumber);
      setModalVisible(false);
      loadContacts();
    }
  };

  const handleDeleteContact = async (contactId) => {
    await deleteEmergencyContact(contactId);
    loadContacts();
  };

  const handleChangeActiveContact = async (contactId) => {
    await changeActiveContact(userId, contactId);
    loadContacts();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Emergency Contacts</Text>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.contactText}>{item.phone_number}</Text>
            <View style={styles.contactActions}>
              <TouchableOpacity style={styles.updateButton} onPress={() => handleOpenModal(item.id, item.phone_number)}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={item.is_active ? styles.activeButton : styles.inactiveButton}
                onPress={() => handleChangeActiveContact(item.id)}
              >
                <Text style={styles.buttonText}>{item.is_active ? 'Active' : 'Set Active'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteContact(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal(null, null)}>
        <Text style={styles.buttonText}>Add New Contact</Text>
      </TouchableOpacity>

      {/* Modal for adding/updating contact */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{isAddMode ? 'Add Contact' : 'Update Contact'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={isAddMode ? newContact : updatedPhoneNumber}
              onChangeText={isAddMode ? setNewContact : setUpdatedPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <View style={styles.modalButtons}>
              <Button title={isAddMode ? "Add" : "Update"} onPress={isAddMode ? handleAddContact : handleUpdateContact} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  contactText: {
    fontSize: 18,
    fontWeight: '500',
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  inactiveButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    fontSize: 18,
    borderColor: '#ced4da',
    borderWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
});

export default EmergencyContactManager;
