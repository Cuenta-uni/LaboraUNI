"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Clock, Users, AlertCircle } from "lucide-react"
import { useAuth } from "./auth-provider"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { setupRealtimeNotifications } from "@/lib/auto-approval"

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

interface CalendarReservation {
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
  labs?: Lab
}

export function CalendarSection() {
  const { user } = useAuth()
  const [selectedLab, setSelectedLab] = useState("all")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [reservations, setReservations] = useState<CalendarReservation[]>([])
  const [labs, setLabs] = useState<Lab[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const isProfessor = user?.user_type === "professor"

  useEffect(() => {
    loadData()
    
    // Configurar notificaciones en tiempo real para el calendario
    const subscription = setupRealtimeNotifications(
      (newReservation) => {
        console.log('📅 Calendar: Nueva reserva detectada:', newReservation)
        loadData() // Recargar datos del calendario
      },
      (approvedReservation) => {
        console.log('📅 Calendar: Reserva aprobada:', approvedReservation)
        loadData() // Actualizar calendario con reserva aprobada
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

      // Cargar laboratorios
      const { data: labsData, error: labsError } = await supabase
        .from('labs')
        .select('*')
        .order('name')

      if (labsError) {
        console.error('Error loading labs:', labsError)
        throw labsError
      }

      setLabs(labsData || [])

      // Cargar reservas - profesores ven todas, estudiantes solo las suyas
      let reservationsQuery = supabase
        .from('reservations')
        .select(`
          *,
          labs!reservations_lab_id_fkey (
            id,
            name,
            building,
            floor,
            capacity
          )
        `)
        .in('status', ['pending', 'approved']) // Mostrar reservas pendientes y aprobadas
        .order('reservation_date', { ascending: true })
        .order('start_time', { ascending: true })

      // Si no es profesor, filtrar solo sus reservas
      if (!isProfessor) {
        reservationsQuery = reservationsQuery.eq('user_id', user.id)
      }

      const { data: reservationsData, error: reservationsError } = await reservationsQuery

      if (reservationsError) {
        console.error('Error loading reservations:', reservationsError)
        throw reservationsError
      }

      setReservations(reservationsData || [])

    } catch (error: any) {
      console.error('Error loading calendar data:', error)
      setError(`Error al cargar datos: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredReservations = selectedLab === "all" 
    ? reservations 
    : reservations.filter((reservation) => reservation.lab_id === parseInt(selectedLab))

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    startOfWeek.setDate(diff)

    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDays.push(date)
    }
    return weekDays
  }

  const getReservationsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return filteredReservations.filter((reservation) => reservation.reservation_date === dateString)
  }

  const getStatusColor = (status: string, isOwnReservation: boolean) => {
    if (status === 'approved') {
      return isOwnReservation ? 'bg-green-50 border-green-500 text-green-900' : 'bg-blue-50 border-blue-500 text-blue-900'
    } else if (status === 'pending') {
      return isOwnReservation ? 'bg-yellow-50 border-yellow-500 text-yellow-900' : 'bg-orange-50 border-orange-500 text-orange-900'
    }
    return 'bg-gray-50 border-gray-500 text-gray-900'
  }

  const weekDays = getWeekDays()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Calendario de Laboratorios</h3>
          <p className="text-sm text-gray-600">
            {isProfessor
              ? "Vista general de todas las reservas de laboratorios"
              : "Consulta tus reservas y la disponibilidad de los laboratorios"}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={selectedLab} onValueChange={setSelectedLab}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por laboratorio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los laboratorios</SelectItem>
              {labs.map((lab) => (
                <SelectItem key={lab.id} value={lab.id.toString()}>
                  {lab.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadData}>
            Actualizar
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={goToPreviousWeek}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Semana Anterior
        </Button>

        <h4 className="text-lg font-medium">
          {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
        </h4>

        <Button variant="outline" onClick={goToNextWeek}>
          Semana Siguiente
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayReservations = getReservationsForDate(day)
          const isToday = day.toDateString() === new Date().toDateString()
          const isPastDate = day < new Date(new Date().setHours(0,0,0,0))

          return (
            <Card key={index} className={`min-h-[200px] ${isToday ? "ring-2 ring-blue-500" : ""} ${isPastDate ? "opacity-60" : ""}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-center">
                  {day.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase()}
                </CardTitle>
                <CardDescription className="text-center">
                  {day.getDate()}
                  {isToday && <span className="text-blue-600 font-medium"> (Hoy)</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {dayReservations.map((reservation) => {
                  const isOwnReservation = reservation.user_id === user?.id
                  const statusColorClass = getStatusColor(reservation.status, isOwnReservation)
                  
                  return (
                    <div key={reservation.id} className={`p-2 rounded-lg border-l-4 text-xs ${statusColorClass}`}>
                      <div className="font-medium mb-1">
                        {reservation.labs?.name || `Lab ID: ${reservation.lab_id}`}
                      </div>
                      <div className="flex items-center space-x-1 mb-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {reservation.start_time} - {reservation.end_time}
                        </span>
                      </div>
                      {isProfessor && (
                        <div className="mb-1">
                          <strong>{isOwnReservation ? 'Tu reserva' : 'Reserva de otro usuario'}</strong>
                          {isOwnReservation && isProfessor && ' (Profesor)'}
                        </div>
                      )}
                      {isOwnReservation && !isProfessor && (
                        <div className="mb-1">
                          <span className="font-medium">Tu reserva</span>
                        </div>
                      )}
                      <div className="mb-1">{reservation.purpose}</div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{reservation.student_count} estudiantes</span>
                      </div>
                      <div className="mt-1">
                        <span className={`text-xs px-1 py-0.5 rounded ${
                          reservation.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reservation.status === 'approved' ? 'Aprobada' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  )
                })}
                {dayReservations.length === 0 && (
                  <div className="text-center text-gray-400 text-xs py-4">
                    {isPastDate ? "Fecha pasada" : "Sin reservas"}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-50 border-l-4 border-green-500 rounded"></div>
          <span>Tu reserva aprobada</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-50 border-l-4 border-yellow-500 rounded"></div>
          <span>Tu reserva pendiente</span>
        </div>
        {isProfessor && (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-50 border-l-4 border-blue-500 rounded"></div>
              <span>Reserva aprobada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-50 border-l-4 border-orange-500 rounded"></div>
              <span>Reserva pendiente</span>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {reservations.filter(r => r.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Reservas aprobadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {reservations.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Reservas pendientes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {labs.filter(l => l.status === 'available').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Laboratorios disponibles
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
