-- Sistema de auto-aprobación de reservas
-- Esta función se ejecutará automáticamente para aprobar reservas después de 10 segundos

-- 1. Crear una función para auto-aprobar reservas
CREATE OR REPLACE FUNCTION auto_approve_reservation() 
RETURNS TRIGGER AS $$
BEGIN
  -- Programar la auto-aprobación para 10 segundos después
  PERFORM pg_notify('reservation_created', 
    json_build_object(
      'reservation_id', NEW.id,
      'user_id', NEW.user_id,
      'lab_id', NEW.lab_id,
      'user_email', (SELECT email FROM user_profiles WHERE id = NEW.user_id),
      'user_name', (SELECT full_name FROM user_profiles WHERE id = NEW.user_id),
      'lab_name', (SELECT name FROM labs WHERE id = NEW.lab_id),
      'reservation_date', NEW.reservation_date,
      'start_time', NEW.start_time,
      'end_time', NEW.end_time,
      'purpose', NEW.purpose,
      'student_count', NEW.student_count
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Crear trigger que se ejecute cuando se inserte una nueva reserva
DROP TRIGGER IF EXISTS trigger_auto_approve_reservation ON reservations;
CREATE TRIGGER trigger_auto_approve_reservation
  AFTER INSERT ON reservations
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION auto_approve_reservation();

-- 3. Función para aprobar una reserva específica
CREATE OR REPLACE FUNCTION approve_reservation(reservation_id_param INTEGER)
RETURNS json AS $$
DECLARE
  updated_reservation reservations%ROWTYPE;
  user_info user_profiles%ROWTYPE;
  lab_info labs%ROWTYPE;
BEGIN
  -- Actualizar el estado de la reserva a 'approved'
  UPDATE reservations 
  SET status = 'approved', updated_at = NOW()
  WHERE id = reservation_id_param AND status = 'pending'
  RETURNING * INTO updated_reservation;
  
  -- Si no se actualizó ninguna fila, la reserva no existe o ya fue procesada
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Reserva no encontrada o ya procesada');
  END IF;
  
  -- Obtener información del usuario y laboratorio
  SELECT * INTO user_info FROM user_profiles WHERE id = updated_reservation.user_id;
  SELECT * INTO lab_info FROM labs WHERE id = updated_reservation.lab_id;
  
  -- Notificar la aprobación
  PERFORM pg_notify('reservation_approved', 
    json_build_object(
      'reservation_id', updated_reservation.id,
      'user_email', user_info.email,
      'user_name', user_info.full_name,
      'lab_name', lab_info.name,
      'reservation_date', updated_reservation.reservation_date,
      'start_time', updated_reservation.start_time,
      'end_time', updated_reservation.end_time,
      'purpose', updated_reservation.purpose
    )::text
  );
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Reserva aprobada exitosamente',
    'reservation', row_to_json(updated_reservation)
  );
END;
$$ LANGUAGE plpgsql;

-- 4. Función para verificar conflictos de horario
CREATE OR REPLACE FUNCTION check_time_conflicts(
  lab_id_param INTEGER,
  reservation_date_param DATE,
  start_time_param TIME,
  end_time_param TIME,
  exclude_reservation_id INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO conflict_count
  FROM reservations
  WHERE lab_id = lab_id_param
    AND reservation_date = reservation_date_param
    AND status IN ('pending', 'approved')
    AND (exclude_reservation_id IS NULL OR id != exclude_reservation_id)
    AND (
      (start_time_param < end_time AND end_time_param > start_time)
    );
  
  RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql;

-- 5. Función para obtener estadísticas de reservas
CREATE OR REPLACE FUNCTION get_reservation_stats()
RETURNS json AS $$
DECLARE
  stats json;
BEGIN
  SELECT json_build_object(
    'total_reservations', COUNT(*),
    'pending_reservations', COUNT(*) FILTER (WHERE status = 'pending'),
    'approved_reservations', COUNT(*) FILTER (WHERE status = 'approved'),
    'rejected_reservations', COUNT(*) FILTER (WHERE status = 'rejected'),
    'cancelled_reservations', COUNT(*) FILTER (WHERE status = 'cancelled'),
    'today_reservations', COUNT(*) FILTER (WHERE reservation_date = CURRENT_DATE),
    'future_reservations', COUNT(*) FILTER (WHERE reservation_date > CURRENT_DATE)
  ) INTO stats
  FROM reservations;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_reservations_status_date ON reservations(status, reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_lab_date_time ON reservations(lab_id, reservation_date, start_time, end_time);

-- Comentarios explicativos
COMMENT ON FUNCTION auto_approve_reservation() IS 'Función que se ejecuta cuando se crea una nueva reserva para programar su auto-aprobación';
COMMENT ON FUNCTION approve_reservation(INTEGER) IS 'Función para aprobar manualmente una reserva específica';
COMMENT ON FUNCTION check_time_conflicts(INTEGER, DATE, TIME, TIME, INTEGER) IS 'Función para verificar conflictos de horario en reservas';
COMMENT ON FUNCTION get_reservation_stats() IS 'Función para obtener estadísticas generales de reservas'; 