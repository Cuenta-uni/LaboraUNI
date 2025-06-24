"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Users,
  Building,
  Activity
} from "lucide-react"
import { getReservationStats, setupRealtimeNotifications } from "@/lib/auto-approval"

interface ReservationStats {
  total_reservations: number
  pending_reservations: number
  approved_reservations: number
  rejected_reservations: number
  cancelled_reservations: number
  today_reservations: number
  future_reservations: number
}

export function ReservationStats() {
  const [stats, setStats] = useState<ReservationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    loadStats()
    
    // Configurar actualizaciones en tiempo real
    const subscription = setupRealtimeNotifications(
      () => {
        console.log("📊 Stats: Nueva reserva, actualizando estadísticas...")
        loadStats()
      },
      () => {
        console.log("📊 Stats: Reserva aprobada, actualizando estadísticas...")
        loadStats()
      }
    )
    
    // Actualizar estadísticas cada 30 segundos
    const interval = setInterval(loadStats, 30000)
    
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
      clearInterval(interval)
    }
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getReservationStats()
      
      if (data) {
        setStats(data)
        setLastUpdate(new Date())
      } else {
        setError("No se pudieron cargar las estadísticas")
      }
    } catch (error: any) {
      console.error('Error loading stats:', error)
      setError(`Error al cargar estadísticas: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      title: "Total de Reservas",
      value: stats.total_reservations,
      icon: Calendar,
      description: "Reservas registradas",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Reservas Pendientes",
      value: stats.pending_reservations,
      icon: Clock,
      description: "Esperando aprobación",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Reservas Aprobadas",
      value: stats.approved_reservations,
      icon: CheckCircle,
      description: "Confirmadas y activas",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Para Hoy",
      value: stats.today_reservations,
      icon: Activity,
      description: "Reservas programadas hoy",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  const approvalRate = stats.total_reservations > 0 
    ? Math.round((stats.approved_reservations / stats.total_reservations) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const IconComponent = card.icon
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${card.bgColor} mr-4`}>
                    <IconComponent className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Tasa de Aprobación</span>
            </CardTitle>
            <CardDescription>
              Porcentaje de reservas aprobadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-green-600">
                {approvalRate}%
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${approvalRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {stats.approved_reservations} de {stats.total_reservations} reservas aprobadas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Reservas Futuras</span>
            </CardTitle>
            <CardDescription>
              Reservas programadas a futuro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Próximas reservas:</span>
                <Badge variant="outline">
                  {stats.future_reservations}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Canceladas:</span>
                <Badge variant="destructive">
                  {stats.cancelled_reservations}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Rechazadas:</span>
                <Badge variant="secondary">
                  {stats.rejected_reservations}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información de actualización */}
      <div className="text-center text-sm text-gray-500">
        <div className="flex items-center justify-center space-x-2">
          <Activity className="h-4 w-4" />
          <span>
            Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
          </span>
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          )}
        </div>
        <p className="mt-1">
          Las estadísticas se actualizan automáticamente en tiempo real
        </p>
      </div>
    </div>
  )
} 