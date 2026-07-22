/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = `https://${supabaseUrl}`
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let client: any

if (isSupabaseConfigured) {
  try {
    client = createClient<Database>(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    createDummyClient()
  }
} else {
  console.warn('Supabase environment variables are missing. Using offline dummy client.')
  createDummyClient()
}

function createDummyClient() {
  client = {
    from: () => ({
      select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Offline mode: Cannot modify data.') }) }) }),
      update: () => ({ eq: () => Promise.resolve({ data: null, error: new Error('Offline mode: Cannot modify data.') }) }),
      delete: () => ({ eq: () => Promise.resolve({ data: null, error: new Error('Offline mode: Cannot modify data.') }) }),
    })
  }
}

export const supabase = client
