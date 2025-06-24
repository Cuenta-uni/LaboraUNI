import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Sistema de Reservas FIEE - UNI',
  description: 'Sistema de reserva de laboratorios para la Facultad de Ingeniería Eléctrica, Electrónica y Telecomunicaciones de la Universidad Nacional de Ingeniería',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
