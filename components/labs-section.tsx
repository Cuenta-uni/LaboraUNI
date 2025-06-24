"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Monitor, Wifi, Zap, FlaskConical, Microscope, Cpu } from "lucide-react"
import { useAuth } from "./auth-provider"

const labs = [
  {
    id: 1,
    name: "Laboratorio de Física I",
    building: "Edificio A",
    floor: "2do Piso",
    capacity: 30,
    equipment: ["Osciloscopios", "Multímetros", "Fuentes de poder"],
    features: ["WiFi", "Proyector", "Aire acondicionado"],
    status: "available",
    icon: FlaskConical,
  },
  {
    id: 2,
    name: "Laboratorio LIFIEE",
    building: "Edificio B",
    floor: "1er Piso",
    capacity: 25,
    equipment: ["Campanas extractoras", "Balanzas analíticas", "Estufas"],
    features: ["Sistema de ventilación", "Ducha de emergencia", "WiFi"],
    status: "occupied",
    icon: FlaskConical,
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
    icon: Cpu,
  },
  {
    id: 4,
    name: "Laboratorio de Eléctrica",
    building: "Edificio D",
    floor: "2do Piso",
    capacity: 20,
    equipment: ["Microscopios", "Autoclaves", "Incubadoras"],
    features: ["Ambiente estéril", "Control de temperatura", "WiFi"],
    status: "maintenance",
    icon: Microscope,
  },
]

export function LabsSection() {
  const { user } = useAuth()
  const isProfessor = user?.user_type === "professor"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible"
      case "occupied":
        return "Ocupado"
      case "maintenance":
        return "Mantenimiento"
      default:
        return "Desconocido"
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
          <FlaskConical className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
            Laboratorios FIEE
          </h3>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explora nuestros laboratorios especializados en Ingeniería Eléctrica, Electrónica y Telecomunicaciones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {labs.map((lab) => {
          const IconComponent = lab.icon
          return (
            <Card key={lab.id} className="group bg-white/70 backdrop-blur-sm border-white/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <IconComponent className="h-7 w-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                        {lab.name}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">
                          {lab.building} - {lab.floor}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(lab.status)} border-0 shadow-sm font-medium`}>
                    {getStatusText(lab.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    Capacidad: <span className="text-blue-600">{lab.capacity} personas</span>
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                    <div className="h-2 w-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                    <span>Equipamiento Disponible</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {lab.equipment.map((item, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs bg-white/50 border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                    <div className="h-2 w-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
                    <span>Características</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {lab.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs text-gray-600 bg-white/40 rounded-lg p-2 border border-white/50">
                        {feature === "WiFi" && <Wifi className="h-4 w-4 text-green-600" />}
                        {feature === "Proyector" && <Monitor className="h-4 w-4 text-blue-600" />}
                        {(feature === "Aire acondicionado" || feature === "Sistema de ventilación") && (
                          <Zap className="h-4 w-4 text-purple-600" />
                        )}
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
