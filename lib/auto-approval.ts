import { supabase } from './supabase'
import { sendReservationApprovalEmail } from './email-service'

interface ReservationApprovalData {
  reservation_id: number
  user_email: string
  user_name: string
  lab_name: string
  reservation_date: string
  start_time: string
  end_time: string
  purpose: string
  student_count: number
}

// Función principal para auto-aprobar una reserva
export const autoApproveReservation = async (reservationId: number): Promise<boolean> => {
  if (!supabase) {
    console.error('Supabase no está configurado')
    return false
  }

  try {
    console.log(`🔄 Iniciando auto-aprobación para reserva ${reservationId}`)

    // Aprobar inmediatamente
    console.log(`⚡ Aprobando reserva inmediatamente: ${reservationId}`)

    // Llamar a la función de PostgreSQL para aprobar la reserva
    const { data, error } = await supabase.rpc('approve_reservation', {
      reservation_id_param: reservationId
    })

    if (error) {
      console.error('Error al aprobar reserva:', error)
      return false
    }

    const result = data as { success: boolean; message: string; reservation?: any }

    if (result.success) {
      console.log('✅ Reserva aprobada exitosamente:', result.message)

      // Obtener detalles completos de la reserva para el email
      const { data: reservationData, error: fetchError } = await supabase
        .from('reservations')
        .select(`
          *,
          labs:lab_id (name),
          user_profiles:user_id (email, full_name)
        `)
        .eq('id', reservationId)
        .single()

      if (!fetchError && reservationData) {
        const emailData = {
          to: reservationData.user_profiles.email,
          subject: 'Reserva de Laboratorio Aprobada - FIEE UNI',
          userName: reservationData.user_profiles.full_name,
          labName: reservationData.labs.name,
          reservationDate: reservationData.reservation_date,
          startTime: reservationData.start_time,
          endTime: reservationData.end_time,
          purpose: reservationData.purpose,
          studentCount: reservationData.student_count,
          reservationId: reservationData.id
        }

        await sendReservationApprovalEmail(emailData)
      }

      return true
    } else {
      console.warn('No se pudo aprobar la reserva:', result.message)
      return false
    }

  } catch (error) {
    console.error('Error durante la auto-aprobación:', error)
    return false
  }
}

// Función para verificar conflictos de horario
export const checkTimeConflicts = async (
  labId: number,
  reservationDate: string,
  startTime: string,
  endTime: string,
  excludeReservationId?: number
): Promise<boolean> => {
  if (!supabase) return false

  try {
    const { data, error } = await supabase.rpc('check_time_conflicts', {
      lab_id_param: labId,
      reservation_date_param: reservationDate,
      start_time_param: startTime,
      end_time_param: endTime,
      exclude_reservation_id: excludeReservationId || null
    })

    if (error) {
      console.error('Error checking time conflicts:', error)
      return false
    }

    return data as boolean
  } catch (error) {
    console.error('Error during conflict check:', error)
    return false
  }
}

// Función para obtener estadísticas de reservas
export const getReservationStats = async () => {
  if (!supabase) return null

  try {
    const { data, error } = await supabase.rpc('get_reservation_stats')

    if (error) {
      console.error('Error getting stats:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error during stats fetch:', error)
    return null
  }
}

// Sistema de notificaciones en tiempo real
export const setupRealtimeNotifications = (
  onReservationCreated?: (data: any) => void,
  onReservationApproved?: (data: any) => void
) => {
  if (!supabase) return

  // Escuchar cambios en las reservas
  const subscription = supabase
    .channel('reservation_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'reservations'
      },
      (payload) => {
        console.log('🔔 Cambio en reservas:', payload)
        
        if (payload.eventType === 'INSERT' && payload.new.status === 'pending') {
          console.log('📝 Nueva reserva creada, iniciando auto-aprobación...')
          
          // Iniciar el proceso de auto-aprobación
          autoApproveReservation(payload.new.id)
          
          if (onReservationCreated) {
            onReservationCreated(payload.new)
          }
        }
        
        if (payload.eventType === 'UPDATE' && payload.new.status === 'approved') {
          console.log('✅ Reserva aprobada:', payload.new.id)
          
          if (onReservationApproved) {
            onReservationApproved(payload.new)
          }
        }
      }
    )
    .subscribe()

  return subscription
} 