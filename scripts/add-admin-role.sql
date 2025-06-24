-- Script para agregar rol de administrador al sistema
-- Ejecutar en el SQL Editor de Supabase

-- 1. Actualizar la restricción CHECK en user_profiles para incluir 'admin'
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_user_type_check;

ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_user_type_check 
CHECK (user_type IN ('student', 'professor', 'admin'));

-- 2. Crear un usuario administrador por defecto (opcional)
-- Nota: Este usuario deberá registrarse normalmente a través del sistema
-- y luego actualizar su tipo de usuario manualmente

-- 3. Función para actualizar un usuario existente a administrador
-- (Ejecutar después de que el usuario se registre)
CREATE OR REPLACE FUNCTION make_user_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles 
  SET user_type = 'admin'
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario con email % no encontrado', user_email;
  END IF;
  
  RAISE NOTICE 'Usuario % actualizado a administrador', user_email;
END;
$$ LANGUAGE plpgsql;

-- 4. Ejemplo de uso:
-- SELECT make_user_admin('admin@fiee.uni.edu.pe');

-- 5. Verificar roles existentes
-- SELECT email, full_name, user_type, faculty FROM user_profiles ORDER BY user_type;

-- 6. Script para crear administrador por defecto (descomentar si deseas usarlo)
/*
-- Este script crea un perfil de administrador después de que el usuario se registre
-- Reemplaza 'admin@fiee.uni.edu.pe' con el email real del administrador

-- Para convertir un usuario existente en administrador:
UPDATE user_profiles 
SET user_type = 'admin', 
    faculty = 'Facultad de Ingeniería Eléctrica, Electrónica y Telecomunicaciones (FIEE)'
WHERE email = 'tu-email-admin@ejemplo.com';
*/

-- 7. Verificar la actualización
SELECT 
  email,
  full_name,
  user_type,
  faculty,
  created_at
FROM user_profiles 
WHERE user_type = 'admin'
ORDER BY created_at DESC; 