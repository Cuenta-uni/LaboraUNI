"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { AuthForm } from "./auth-form"
import { SupabaseSetup } from "./supabase-setup"

interface User {
  id: string
  email: string
  user_type: "student" | "professor" | "admin"
  faculty: string
  university_code: string
  full_name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  forceSignOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  forceSignOut: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Si Supabase no está configurado, mostrar componente de configuración en desarrollo
  // En producción, mostrar error
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Error de Configuración
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                La aplicación no está configurada correctamente. 
                Por favor contacta al administrador.
              </p>
            </div>
          </div>
        </div>
      )
    }
    return <SupabaseSetup />
  }

  useEffect(() => {
    if (!supabase) return

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session?.user?.id)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.id)
      
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id)
      } else if (event === 'SIGNED_OUT' || !session?.user) {
        console.log("User signed out, clearing state...")
        setUser(null)
        /* setLoading(false) */
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Token was refreshed, ensure we still have the user data
        if (!user) {
          await fetchUserProfile(session.user.id)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return

    console.log("Fetching profile for user:", userId)
    
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

      console.log("Profile query result:", { data, error })

      if (error) {
        console.error("Database error:", error)
        
        // Si es un error de tabla no existe o permisos, mostrar mensaje informativo
        if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('permission')) {
          alert(`Error de base de datos: ${error.message}\n\nPor favor:\n1. Asegúrate de que las tablas estén creadas\n2. Ejecuta el script create-tables.sql\n3. Verifica los permisos de RLS`)
          await supabase.auth.signOut()
          setUser(null)
          setLoading(false)
          return
        }
        
        throw error
      }

      if (data) {
        console.log("User profile found:", data)
        setUser({
          id: data.id,
          email: data.email,
          user_type: data.user_type,
          faculty: data.faculty,
          university_code: data.university_code,
          full_name: data.full_name,
        })
      } else {
        console.warn("User profile not found for user:", userId)
        alert("No se encontró el perfil de usuario. Esto puede suceder si:\n\n1. Es tu primer login y necesitas completar el registro\n2. Las tablas de la base de datos no están creadas\n3. Hay un problema con los permisos\n\nSerás redirigido al formulario de login.")
        await supabase.auth.signOut()
        setUser(null)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      alert(`Error al obtener el perfil: ${error}`)
      if (supabase) {
        await supabase.auth.signOut()
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    console.log("Starting logout process...")
    setLoading(true)
    
    try {
      if (supabase) {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error("Error during logout:", error)
          throw error
        }
        console.log("Logout successful")
        
        // Verificar que la sesión se haya limpiado
        const { data: { session } } = await supabase.auth.getSession()
        console.log("Session after logout:", session)
        
        if (session) {
          console.warn("Session still exists after logout, forcing cleanup...")
        }
      }
      
      // Forzar la limpieza del estado
      console.log("Clearing user state...")
      setUser(null)
      
      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        setLoading(false)
        console.log("Logout process completed")
      }, 100)
      
    } catch (error) {
      console.error("Failed to sign out:", error)
      // Incluso si hay error, limpiamos el estado local
      setUser(null)
      setLoading(false)
    }
  }

  // Función alternativa más agresiva para debugging
  const forceSignOut = () => {
    console.log("Force sign out - clearing all state immediately")
    setUser(null)
    setLoading(false)
    
    // También limpiar localStorage si existe algún token guardado
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('sb-' + (process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] || '') + '-auth-token')
    }
    
    if (supabase) {
      supabase.auth.signOut().catch(console.error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return <AuthContext.Provider value={{ user, loading, signOut, forceSignOut }}>{children}</AuthContext.Provider>
}
