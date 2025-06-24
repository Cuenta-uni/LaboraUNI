"use client"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FlaskConical, BookOpen, LogOut, User, Bell } from "lucide-react"
import { LabsSection } from "./labs-section"
import { ReservationsSection } from "./reservations-section"
import { CalendarSection } from "./calendar-section"
import { AdminReservations } from "./admin-reservations"
import { useToast } from "@/components/ui/use-toast"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FixFacultyButton } from "./fix-faculty-button"

export function Dashboard() {
  const { user, signOut, loading } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("labs")
  const [isSigningOut, setIsSigningOut] = useState(false)

  const isProfessor = user?.user_type === "professor"
  const isAdmin = user?.user_type === "admin"

  const handleSignOut = async () => {
    console.log("Dashboard: Starting sign out...")
    setIsSigningOut(true)
    try {
      await signOut()
      console.log("Dashboard: Sign out completed")
    } catch (error) {
      console.error("Dashboard: Sign out failed:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-lg">
                  <FlaskConical className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Laboratorios FIEE
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Facultad de Ingeniería Eléctrica, Electrónica y Telecomunicaciones
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{user?.full_name}</p>
                  <p className="text-gray-600">{user?.university_code}</p>
                </div>
                <Badge 
                  variant={isProfessor || isAdmin ? "default" : "secondary"}
                  className={isProfessor 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0" 
                    : isAdmin
                    ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-0"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-0"
                  }
                >
                  {isProfessor ? "Profesor" : isAdmin ? "Administrador" : "Estudiante"}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-3">
                <FixFacultyButton />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/60 backdrop-blur-sm border-white/30 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                  onClick={handleSignOut}
                  disabled={isSigningOut || loading}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isSigningOut ? "Saliendo..." : "Salir"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Bienvenido, {user?.full_name}
            </h2>
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <div className="h-2 w-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
              <p className="text-gray-700 font-medium">{user?.faculty}</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className={`grid ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'} bg-white/70 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-1`}>
              <TabsTrigger 
                value="labs" 
                className="flex items-center space-x-2 rounded-xl transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <FlaskConical className="h-4 w-4" />
                <span className="font-medium">Laboratorios</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reservations" 
                className="flex items-center space-x-2 rounded-xl transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">Reservas</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger 
                  value="admin" 
                  className="flex items-center space-x-2 rounded-xl transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <Bell className="h-4 w-4" />
                  <span className="font-medium">Administración</span>
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="calendar" 
                className="flex items-center space-x-2 rounded-xl transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Calendario</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="labs">
            <LabsSection />
          </TabsContent>

          <TabsContent value="reservations">
            <ReservationsSection />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin">
              <AdminReservations />
            </TabsContent>
          )}

          <TabsContent value="calendar">
            <CalendarSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
