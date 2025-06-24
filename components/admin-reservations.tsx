"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  User,
  Shield,
  Loader2
} from "lucide-react"
import { useAuth } from "./auth-provider"
import { supabase } from "@/lib/supabase"

interface AdminReservation {
  id: number
  user_id: string
  lab_id: number
  reservation_date: string
  start_time: string
  end_time: string
  purpose: string
  student_count: number
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  created_at: string
  lab?: {
    id: number
    name: string
    building: string
    floor: string
  }
  user_profile?: {
    id: string
    email: string
    full_name: string
    user_type: string
    faculty: string
  }
}

export function AdminReservations() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [reservations, setReservations] = useState<AdminReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = user?.user_type === "admin"

  useEffect(() => {
    if (isAdmin) {
      loadReservations()
    }
  }, [isAdmin])

  const loadReservations = async () => {
    if (!supabase || !user) return

    try {
      setLoading(true)
      setError(null)

      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select(`
          *,
          user_profiles:user_id (
            id,
            email,
            full_name,
            user_type,
            faculty
          )
        `)
        .order('created_at', { ascending: false })

      if (reservationsError) {
        console.error('Error loading reservations:', reservationsError)
        throw reservationsError
      }

      // Agregar información del laboratorio hardcodeada ya que usamos labs fijos
      const labsMap = {
        1: { id: 1, name: "Laboratorio de Física I", building: "Edificio A", floor: "2do Piso" },
        2: { id: 2, name: "Laboratorio LIFIEE", building: "Edificio B", floor: "1er Piso" },
        3: { id: 3, name: "Laboratorio de Telecomunicaciones", building: "Edificio C", floor: "3er Piso" },
        4: { id: 4, name: "Laboratorio de Eléctrica", building: "Edificio D", floor: "2do Piso" }
      }

      const reservationsWithLabs = (reservationsData || []).map(reservation => ({
        ...reservation,
        lab: labsMap[reservation.lab_id as keyof typeof labsMap]
      }))

      setReservations(reservationsWithLabs)

    } catch (error: any) {
      console.error('Error loading admin reservations:', error)
      setError(`Error al cargar reservas: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveReservation = async (reservationId: number) => {
    if (!supabase) return

    setProcessing(reservationId)
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'approved' })
        .eq('id', reservationId)

      if (error) throw error

      setReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, status: 'approved' as const }
            : res
        )
      )

      const reservation = reservations.find(r => r.id === reservationId)
      if (reservation && reservation.user_profile) {
        try {
          const { sendReservationApprovalEmail } = await import('@/lib/email-service')
          await sendReservationApprovalEmail({
            to: reservation.user_profile.email,
            subject: 'Reserva Aprobada - FIEE UNI',
            userName: reservation.user_profile.full_name,
            labName: reservation.lab?.name || 'Laboratorio',
            reservationDate: reservation.reservation_date,
            startTime: reservation.start_time,
            endTime: reservation.end_time,
            purpose: reservation.purpose,
            studentCount: reservation.student_count,
            reservationId: reservation.id
          })
        } catch (emailError) {
          console.error('Error enviando email:', emailError)
        }
      }

      toast({
        title: "✅ Reserva Aprobada",
        description: `La reserva ha sido aprobada exitosamente. Se envió email de confirmación.`,
        duration: 5000,
      })

    } catch (error: any) {
      console.error('Error approving reservation:', error)
      setError(`Error al aprobar reserva: ${error.message}`)
    } finally {
      setProcessing(null)
    }
  }

  const handleRejectReservation = async (reservationId: number) => {
    if (!supabase) return

    setProcessing(reservationId)
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'rejected' })
        .eq('id', reservationId)

      if (error) throw error

      setReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, status: 'rejected' as const }
            : res
        )
      )

      toast({
        title: "❌ Reserva Rechazada",
        description: `La reserva ha sido rechazada.`,
        duration: 5000,
      })

    } catch (error: any) {
      console.error('Error rejecting reservation:', error)
      setError(`Error al rechazar reserva: ${error.message}`)
    } finally {
      setProcessing(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "Aprobada"
      case "pending": return "Pendiente"
      case "rejected": return "Rechazada"
      case "cancelled": return "Cancelada"
      default: return "Desconocido"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4" />
      case "pending": return <AlertCircle className="h-4 w-4" />
      case "rejected": return <XCircle className="h-4 w-4" />
      default: return null
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso Restringido</h3>
            <p className="text-gray-600">Solo los administradores pueden acceder a esta sección.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const pendingReservations = reservations.filter(r => r.status === 'pending')
  const processedReservations = reservations.filter(r => r.status !== 'pending')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Panel de Administración - Reservas
          </h3>
          <p className="text-sm text-gray-600">Gestiona las solicitudes de reserva de laboratorio</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {pendingReservations.length} pendientes
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          Reservas Pendientes ({pendingReservations.length})
        </h4>
        
        {pendingReservations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">No hay reservas pendientes.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingReservations.map((reservation) => (
              <Card key={reservation.id} className="border-yellow-200 bg-yellow-50/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{reservation.lab?.name}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{reservation.user_profile?.full_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {reservation.user_profile?.user_type === 'student' ? 'Estudiante' : 'Profesor'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(reservation.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(reservation.status)}
                        <span>{getStatusText(reservation.status)}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(reservation.reservation_date).toLocaleDateString("es-ES")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{reservation.start_time} - {reservation.end_time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">Estudiantes:</span>
                        <span>{reservation.student_count}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Propósito:</p>
                      <p className="text-sm text-gray-600 bg-white p-2 rounded border">{reservation.purpose}</p>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button 
                        onClick={() => handleApproveReservation(reservation.id)}
                        disabled={processing === reservation.id}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        {processing === reservation.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Aprobar
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleRejectReservation(reservation.id)}
                        disabled={processing === reservation.id}
                        size="sm"
                      >
                        {processing === reservation.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {processedReservations.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-900">
            Historial ({processedReservations.length})
          </h4>
          
          <div className="grid gap-4">
            {processedReservations.slice(0, 5).map((reservation) => (
              <Card key={reservation.id} className="bg-gray-50/30">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {reservation.lab?.name} - {reservation.user_profile?.full_name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(reservation.reservation_date).toLocaleDateString("es-ES")} • {reservation.start_time}
                      </p>
                    </div>
                    <Badge className={getStatusColor(reservation.status)} variant="outline">
                      {getStatusText(reservation.status)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 