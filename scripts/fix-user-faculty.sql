-- Script para actualizar la facultad del usuario a FIEE
-- Este script corrige la facultad de todos los usuarios para que sea la correcta

UPDATE user_profiles 
SET faculty = 'Facultad de Ingeniería Eléctrica, Electrónica y Telecomunicaciones (FIEE)'
WHERE faculty = 'Facultad de Ingeniería Económica, Estadística y Ciencias Sociales'
   OR faculty NOT LIKE '%Eléctrica, Electrónica y Telecomunicaciones%';

-- Verificar los cambios
SELECT id, full_name, faculty, university_code 
FROM user_profiles; 