import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

// Using environment variables for Supabase credentials.
// For Vite, environment variables must be prefixed with VITE_.
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY should be set in .env.local
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Ensure URL has http/https protocol
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = `https://${supabaseUrl}`
}

let client: any
try {
  client = createClient<Database>(supabaseUrl, supabaseAnonKey)
} catch (error) {
  console.error('Failed to initialize Supabase client:', error)
  // Create a dummy client to prevent synchronous crashes
  client = {
    from: () => ({
      select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Invalid Supabase Config') }) }) }),
      update: () => Promise.resolve({ data: null, error: new Error('Invalid Supabase Config') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Invalid Supabase Config') }),
    })
  }
}

export const supabase = client
