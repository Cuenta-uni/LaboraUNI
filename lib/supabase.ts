import { createClient } from "@supabase/supabase-js"

// Access environment variables through process.env with fallback
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl) {
  throw new Error("Missing Supabase URL. Please check your environment variables.")
}

if (!supabaseAnonKey) {
  throw new Error("Missing Supabase Anon Key. Please check your environment variables.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
