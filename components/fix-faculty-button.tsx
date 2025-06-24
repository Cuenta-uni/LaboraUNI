"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

export function FixFacultyButton() {
  const { user } = useAuth()
  const { toast } = useToast()

  const fixFaculty = async () => {
    if (!supabase || !user) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          faculty: 'Facultad de Ingeniería Eléctrica, Electrónica y Telecomunicaciones (FIEE)' 
        })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: "✅ Facultad Actualizada",
        description: "Tu facultad ha sido actualizada correctamente a FIEE. Recarga la página para ver los cambios.",
        duration: 5000,
      })

      // Recargar la página después de 2 segundos
      setTimeout(() => {
        window.location.reload()
      }, 2000)

    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: `Error al actualizar la facultad: ${error.message}`,
        duration: 5000,
      })
    }
  }

  // Solo mostrar el botón si la facultad no es FIEE
  if (!user || user.faculty.includes('Eléctrica, Electrónica y Telecomunicaciones')) {
    return null
  }

  return (
    <Button 
      onClick={fixFaculty}
      className="bg-orange-600 hover:bg-orange-700 text-white"
      size="sm"
    >
      🔧 Arreglar Facultad
    </Button>
  )
} 