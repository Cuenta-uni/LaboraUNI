import { createClient } from "@supabase/supabase-js"

// Access environment variables through process.env with fallback
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

if (!supabaseUrl) {
  console.error("Missing Supabase URL. Please check your environment variables.")
  if (process.env.NODE_ENV === 'production') {
    throw new Error("Missing Supabase URL. Please check your environment variables.")
  }
}

if (!supabaseAnonKey) {
  console.error("Missing Supabase Anon Key. Please check your environment variables.")
  if (process.env.NODE_ENV === 'production') {
    throw new Error("Missing Supabase Anon Key. Please check your environment variables.")
  }
}

// Create Supabase client only if properly configured
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
