"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { setupRealtimeNotifications, checkTimeConflicts } from "@/lib/auto-approval"
import { useToast } from "@/components/ui/use-toast"

interface Lab {
  id: number
  name: string
  building: string
  floor: string
  capacity: number
  equipment: string[]
  features: string[]
  status: string
}

interface Reservation {
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
  // Joined data
  lab?: Lab
}

export function ReservationsSection() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [labs, setLabs] = useState<Lab[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    labId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    students: "",
  })

  useEffect(() => {
    loadData()
    
    // Configurar notificaciones en tiempo real
    const subscription = setupRealtimeNotifications(
      (newReservation) => {
        console.log('🔔 Nueva reserva detectada:', newReservation)
        // Recargar datos cuando se cree una nueva reserva
        loadData()
      },
      (approvedReservation) => {
        console.log('✅ Reserva aprobada:', approvedReservation)
        // Recargar datos cuando se apruebe una reserva
        loadData()
      }
    )
    
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [user])

  const loadData = async () => {
    if (!supabase || !user) return

    try {
      setLoading(true)
      setError(null)

      // Usar los mismos laboratorios que en la portada para consistencia
      const labsData = [
        {
          id: 1,
          name: "Laboratorio de Física I",
          building: "Edificio A",
          floor: "2do Piso",
          capacity: 30,
          equipment: ["Osciloscopios", "Multímetros", "Fuentes de poder"],
          features: ["WiFi", "Proyector", "Aire acondicionado"],
          status: "available",
        },
        {
          id: 2,
          name: "Laboratorio LIFIEE",
          building: "Edificio B",
          floor: "1er Piso",
          capacity: 25,
          equipment: ["Campanas extractoras", "Balanzas analíticas", "Estufas"],
          features: ["Sistema de ventilación", "Ducha de emergencia", "WiFi"],
          status: "available",
        },
        {
          id: 3,
          name: "Laboratorio de Telecomunicaciones",
          building: "Edificio C",
          floor: "3er Piso",
          capacity: 40,
          equipment: ["PCs Intel i7", "Software especializado", "Servidores"],
          features: ["WiFi", "Aire acondicionado", "Proyector"],
          status: "available",
        },
        {
          id: 4,
          name: "Laboratorio de Eléctrica",
          building: "Edificio D",
          floor: "2do Piso",
          capacity: 20,
          equipment: ["Microscopios", "Autoclaves", "Incubadoras"],
          features: ["Ambiente estéril", "Control de temperatura", "WiFi"],
          status: "available",
        },
      ]

      setLabs(labsData)

      // Cargar reservas del usuario
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select(`
          *,
          labs:lab_id (
            id,
            name,
            building,
            floor,
            capacity
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (reservationsError) {
        console.error('Error loading reservations:', reservationsError)
        throw reservationsError
      }

      setReservations(reservationsData || [])

    } catch (error: any) {
      console.error('Error loading data:', error)
      setError(`Error al cargar datos: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprobada"
      case "pending":
        return "Pendiente"
      case "rejected":
        return "Rechazada"
      case "cancelled":
        return "Cancelada"
      default:
        return "Desconocido"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabase || !user) {
      setError("Error: No hay usuario autenticado")
      return
    }

    // Validaciones adicionales de fecha y hora
    const selectedDate = new Date(formData.date + "T00:00:00")
    const today = new Date()
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    // Solo prohibir fechas completamente pasadas (no el día actual)
    if (selectedDate < todayOnly) {
      setError("No puedes reservar para fechas pasadas")
      return
    }

    // Si es para hoy, validar que la hora sea al menos 30 minutos en el futuro
    const isToday = selectedDate.getTime() === todayOnly.getTime()
    if (isToday) {
      const now = new Date()
      const [startHour, startMinute] = formData.startTime.split(':').map(Number)
      const reservationTime = new Date()
      reservationTime.setHours(startHour, startMinute, 0, 0)
      
      // Permitir 30 minutos de margen
      const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000)

      if (reservationTime < thirtyMinutesFromNow) {
        setError(`Para reservas de hoy, la hora de inicio debe ser al menos 30 minutos después de ahora (${thirtyMinutesFromNow.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })})`)
        return
      }
    }

    // Validar que la hora de inicio sea antes que la de fin
    const [startHour, startMin] = formData.startTime.split(':').map(Number)
    const [endHour, endMin] = formData.endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    if (startMinutes >= endMinutes) {
      setError("La hora de fin debe ser posterior a la hora de inicio")
      return
    }

    // Validar duración mínima de 1 hora
    if (endMinutes - startMinutes < 60) {
      setError("La reserva debe ser de al menos 1 hora de duración")
      return
    }

    // Verificar conflictos de horario
    const hasConflicts = await checkTimeConflicts(
      parseInt(formData.labId),
      formData.date,
      formData.startTime,
      formData.endTime
    )

    if (hasConflicts) {
      setError("Ya existe una reserva en ese horario para el laboratorio seleccionado")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      console.log("Creating reservation with data:", formData)

      const reservationData = {
        user_id: user.id,
        lab_id: parseInt(formData.labId),
        reservation_date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
        purpose: formData.purpose,
        student_count: parseInt(formData.students),
        status: 'pending' as const
      }

      const { data, error } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select(`
          *,
          labs:lab_id (
            id,
            name,
            building,
            floor,
            capacity
          )
        `)

      if (error) {
        console.error('Error creating reservation:', error)
        throw error
      }

      console.log("Reservation created successfully:", data)

      // Actualizar la lista de reservas
      if (data && data.length > 0) {
        const newReservation = data[0]
        setReservations(prev => [newReservation, ...prev])
        
        // Reserva creada en estado pendiente, esperando aprobación del administrador
        console.log("📝 Reserva creada en estado pendiente:", newReservation.id)
        
        // Mostrar notificación toast de éxito
        setError(null)
        const selectedLab = labs.find(l => l.id === parseInt(formData.labId))
        
        toast({
          title: "📝 ¡Reserva Enviada!",
          description: `Tu reserva para ${selectedLab?.name} el ${new Date(formData.date).toLocaleDateString('es-ES')} de ${formData.startTime} a ${formData.endTime} ha sido enviada y está pendiente de aprobación por el administrador.`,
          duration: 5000,
        })
      }

      // Limpiar formulario y cerrar dialog
      setFormData({
        labId: "",
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
        students: "",
      })
      setIsDialogOpen(false)

    } catch (error: any) {
      console.error('Failed to create reservation:', error)
      setError(`Error al crear la reserva: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelReservation = async (reservationId: number) => {
    if (!supabase || !user) return

    try {
      // Obtener detalles de la reserva antes de cancelarla
      const reservationToCancel = reservations.find(r => r.id === reservationId)
      if (!reservationToCancel) {
        setError("No se encontró la reserva")
        return
      }

      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId)

      if (error) throw error

      // Actualizar estado local - eliminar la reserva de la lista
      setReservations(prev => 
        prev.filter(res => res.id !== reservationId)
      )

      // Enviar email de cancelación
      const { sendReservationCancellationEmail } = await import('@/lib/email-service')
      await sendReservationCancellationEmail({
        to: user.email,
        subject: 'Reserva Cancelada - FIEE UNI',
        userName: user.full_name,
        labName: reservationToCancel.lab?.name || `Lab ID: ${reservationToCancel.lab_id}`,
        reservationDate: reservationToCancel.reservation_date,
        startTime: reservationToCancel.start_time,
        endTime: reservationToCancel.end_time,
        purpose: reservationToCancel.purpose,
        studentCount: reservationToCancel.student_count,
        reservationId: reservationToCancel.id
      })

      // Limpiar errores y mostrar mensaje de éxito
      setError(null)
      
      // Notificación toast de éxito
      toast({
        title: "🗑️ Reserva Eliminada",
        description: `Tu reserva para ${reservationToCancel.lab?.name || 'el laboratorio'} ha sido eliminada exitosamente. Se ha enviado un email de confirmación.`,
        duration: 5000,
      })
      
      // Mensaje de confirmación en consola
      console.log('✅ Reserva cancelada exitosamente')

    } catch (error: any) {
      console.error('Error cancelling reservation:', error)
      setError(`Error al cancelar la reserva: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Reservas</h3>
          <p className="text-sm text-gray-600">Administra tus solicitudes de reserva de laboratorios</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reserva
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Solicitar Nueva Reserva</DialogTitle>
              <DialogDescription>Completa los datos para solicitar una reserva de laboratorio</DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="labId">Laboratorio</Label>
                <Select
                  value={formData.labId}
                  onValueChange={(value: string) => setFormData({ ...formData, labId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un laboratorio" />
                  </SelectTrigger>
                  <SelectContent>
                    {labs.map((lab) => (
                      <SelectItem key={lab.id} value={lab.id.toString()}>
                        {lab.name} - {lab.building}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="students">N° Estudiantes</Label>
                  <Input
                    id="students"
                    type="number"
                    value={formData.students}
                    onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                    placeholder="25"
                    min="1"
                    max="50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Hora Inicio</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Hora Fin</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Propósito de la Reserva</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Describe el propósito de la reserva..."
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Enviando..." : "Enviar Solicitud"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {reservations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No tienes reservas aún. ¡Crea tu primera reserva!</p>
            </CardContent>
          </Card>
        ) : (
          reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{reservation.lab?.name || `Lab ID: ${reservation.lab_id}`}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">{reservation.purpose}</CardDescription>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{new Date(reservation.reservation_date).toLocaleDateString("es-ES")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {reservation.start_time} - {reservation.end_time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Estudiantes:</span>
                    <span>{reservation.student_count}</span>
                  </div>
                </div>

                {reservation.status === "pending" && (
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
