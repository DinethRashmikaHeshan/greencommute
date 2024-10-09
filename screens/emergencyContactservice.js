// emergencyContactService.js
import { supabase } from '../lib/supabase';

// Fetch emergency contacts for a user
export const fetchEmergencyContacts = async (userId) => {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

// Add a new emergency contact
export const addEmergencyContact = async (userId, phoneNumber) => {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .insert([{ user_id: userId, phone_number: phoneNumber, is_active: false }]);

  if (error) throw error;
  return data;
};

// Update an existing emergency contact
export const updateEmergencyContact = async (contactId, phoneNumber) => {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .update({ phone_number: phoneNumber })
    .eq('id', contactId);

  if (error) throw error;
  return data;
};

// Delete an emergency contact
export const deleteEmergencyContact = async (contactId) => {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .delete()
    .eq('id', contactId);

  if (error) throw error;
  return data;
};

// Change the active emergency contact
export const changeActiveContact = async (userId, contactId) => {
  // Deactivate all contacts for the user
  await supabase
    .from('emergency_contacts')
    .update({ is_active: false })
    .eq('user_id', userId);

  // Activate the selected contact
  const { data, error } = await supabase
    .from('emergency_contacts')
    .update({ is_active: true })
    .eq('id', contactId);

  if (error) throw error;
  return data;
};
