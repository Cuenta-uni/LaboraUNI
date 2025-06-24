"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Database, Key, Settings, ExternalLink } from "lucide-react"

export function SupabaseSetup() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full max-w-2xl">
        <Card className="bg-white/80 backdrop-blur-lg border-white/30 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 shadow-2xl">
                <Settings className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-orange-700 bg-clip-text text-transparent">
                Configuración Requerida
              </CardTitle>
              <CardDescription className="text-gray-600">
                Para usar el Sistema de Reservas FIEE, necesitas configurar Supabase
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert className="border-orange-200 bg-orange-50">
              <Database className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Supabase no está configurado.</strong> El sistema requiere una base de datos para funcionar.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">1</span>
                  Crear proyecto en Supabase
                </h3>
                <div className="ml-8 space-y-2">
                  <p className="text-sm text-gray-600">
                    Ve a <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      supabase.com <ExternalLink className="h-3 w-3" />
                    </a> y crea un nuevo proyecto
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">2</span>
                  Obtener credenciales
                </h3>
                <div className="ml-8 space-y-3">
                  <p className="text-sm text-gray-600">
                    En tu proyecto de Supabase, ve a <Badge variant="outline">Settings → API</Badge> y copia:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Database className="h-4 w-4 text-gray-500" />
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">Project URL</code>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Key className="h-4 w-4 text-gray-500" />
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">anon public key</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">3</span>
                  Configurar variables de entorno
                </h3>
                <div className="ml-8 space-y-3">
                  <p className="text-sm text-gray-600">
                    Crea un archivo <code className="bg-gray-100 px-2 py-1 rounded text-xs">.env.local</code> en la raíz del proyecto:
                  </p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono">
                    <div>NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co</div>
                    <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">4</span>
                  Ejecutar scripts de base de datos
                </h3>
                <div className="ml-8 space-y-2">
                  <p className="text-sm text-gray-600">
                    En el SQL Editor de Supabase, ejecuta los scripts en orden:
                  </p>
                  <div className="text-sm space-y-1">
                    <div>📄 <code className="text-xs bg-gray-100 px-2 py-1 rounded">scripts/create-tables.sql</code></div>
                    <div>📄 <code className="text-xs bg-gray-100 px-2 py-1 rounded">scripts/labs-fiee-telecomunicaciones.sql</code></div>
                    <div>📄 <code className="text-xs bg-gray-100 px-2 py-1 rounded">scripts/fix-rls-permissive.sql</code></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-sm font-bold">5</span>
                  Reiniciar la aplicación
                </h3>
                <div className="ml-8">
                  <p className="text-sm text-gray-600">
                    Después de configurar las variables de entorno, reinicia el servidor de desarrollo.
                  </p>
                </div>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                <strong>💡 Tip:</strong> Una vez configurado, podrás registrarte y comenzar a usar el sistema de reservas.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 