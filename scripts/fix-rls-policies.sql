-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can view labs" ON labs;
DROP POLICY IF EXISTS "Users can view their own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can insert their own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can update their own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can delete their own reservations" ON reservations;

-- Habilitar RLS en las tablas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Políticas para labs (todos pueden ver los laboratorios)
CREATE POLICY "Anyone can view labs" ON labs
  FOR SELECT 
  USING (true);

-- Políticas para reservations
CREATE POLICY "Users can view their own reservations" ON reservations
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reservations" ON reservations
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations" ON reservations
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reservations" ON reservations
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'labs', 'reservations')
ORDER BY tablename, policyname; 