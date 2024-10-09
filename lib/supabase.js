import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://oxtkppsxpchrjdrcyogq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dGtwcHN4cGNocmpkcmN5b2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzNzg4NjQsImV4cCI6MjA0Mzk1NDg2NH0.Rk3OLHpfFL2dVqwcsLhOcz-Pn48H9djHCkRGYiTXu18";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})