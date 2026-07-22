import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

// Using environment variables for Supabase credentials.
// For Vite, environment variables must be prefixed with VITE_.
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY should be set in .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
