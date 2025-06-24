-- Solución alternativa: Políticas más permisivas
-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- Crear políticas más permisivas
CREATE POLICY "Enable read access for authenticated users" ON user_profiles
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON user_profiles
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user_id" ON user_profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Verificar que se crearon correctamente
SELECT policyname, cmd, permissive, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'; 