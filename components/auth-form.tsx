"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GraduationCap, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AnimatedBackground } from "@/components/ui/animated-background"

const faculties = [
  "Facultad de Ingeniería Eléctrica, Electrónica y Telecomunicaciones (FIEE)",
  "Facultad de Ingeniería Civil",
  "Facultad de Ingeniería Mecánica",
  "Facultad de Ingeniería Química y Textil",
  "Facultad de Ingeniería Geológica, Minera y Metalúrgica",
  "Facultad de Ingeniería Industrial y de Sistemas",
  "Facultad de Ingeniería Ambiental",
  "Facultad de Ciencias",
  "Facultad de Arquitectura, Urbanismo y Artes",
]

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    userType: "",
    faculty: "",
    universityCode: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (!supabase) {
      setError("⚠️ Base de datos no configurada. Para usar este sistema necesitas configurar Supabase correctamente en las variables de entorno.")
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        console.log("Attempting login with:", formData.email)
        
        // Verificar si Supabase está usando configuración por defecto
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
        if (supabaseUrl.includes("your-project-id")) {
          throw new Error("SUPABASE_NOT_CONFIGURED")
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        
        console.log("Login result:", { data, error })
        
        if (error) throw error
        
        if (data.user) {
          console.log("Login successful, user:", data.user.id)
          setMessage("Inicio de sesión exitoso. Cargando perfil...")
        }
      } else {
        console.log("Attempting signup with:", formData.email)
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })

        console.log("Signup result:", { data, error })

        if (error) throw error

        if (data.user) {
          console.log("Creating profile for user:", data.user.id)
          // Insert user profile
          const { error: profileError } = await supabase.from("user_profiles").insert({
            id: data.user.id,
            email: formData.email,
            full_name: formData.fullName,
            user_type: formData.userType,
            faculty: formData.faculty,
            university_code: formData.universityCode,
          })

          if (profileError) {
            console.error("Profile creation error:", profileError)
            throw profileError
          }
          
          console.log("Profile created successfully")
          
          if (data.session) {
            setMessage("Registro exitoso. Redirigiendo...")
          } else {
            setMessage("Registro exitoso. Por favor verifica tu email para activar tu cuenta.")
          }
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error)
      let errorMessage = error.message
      
      // Personalizar mensajes de error
      if (error.message === 'SUPABASE_NOT_CONFIGURED') {
        errorMessage = "🔧 Supabase no está configurado. Las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY deben ser configuradas correctamente."
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = "❌ Credenciales incorrectas. Verifica tu email y contraseña o regístrate si no tienes cuenta."
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "📧 Por favor confirma tu email antes de iniciar sesión."
      } else if (error.message.includes('User already registered')) {
        errorMessage = "👤 Este email ya está registrado. Intenta iniciar sesión."
      } else if (error.code === '42P01' || error.message.includes('relation')) {
        errorMessage = "🗃️ Error de base de datos: Las tablas no están creadas. Contacta al administrador."
      } else if (error.message.includes('fetch')) {
        errorMessage = "🌐 Error de conexión. Verifica que Supabase esté configurado correctamente."
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      <AnimatedBackground />
      <div className="w-full max-w-md">
        <Card className="bg-white/80 backdrop-blur-lg border-white/30 shadow-2xl">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-2xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-3 border-white"></div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Sistema de Reservas FIEE
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Facultad de Ingeniería Eléctrica, Electrónica y Telecomunicaciones
              </CardDescription>
              <div className="flex items-center justify-center space-x-2 pt-2">
                <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
              </div>
            </div>
          </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {message && (
            <Alert className="mb-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Tipo de Usuario</Label>
                  <RadioGroup
                    value={formData.userType}
                    onValueChange={(value: string) => setFormData({ ...formData, userType: value })}
                    disabled={loading}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student">Estudiante</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professor" id="professor" />
                      <Label htmlFor="professor">Profesor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="admin" />
                      <Label htmlFor="admin">Administrador de Laboratorio</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faculty">Facultad</Label>
                  <Select
                    value={formData.faculty}
                    onValueChange={(value: string) => setFormData({ ...formData, faculty: value })}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu facultad" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty} value={faculty}>
                          {faculty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="universityCode">Código Universitario</Label>
                  <Input
                    id="universityCode"
                    value={formData.universityCode}
                    onChange={(e) => setFormData({ ...formData, universityCode: e.target.value })}
                    placeholder="Ej: 20201234A"
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Procesando..." : isLogin ? "Iniciar Sesión" : "Registrarse"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError(null)
                  setMessage(null)
                }}
                className="text-sm text-blue-600 hover:underline"
                disabled={loading}
              >
                {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>
          </form>
        </CardContent>
        </Card>
      </div>
    </div>
  )
}
