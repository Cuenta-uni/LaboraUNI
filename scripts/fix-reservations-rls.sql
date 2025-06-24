-- Deshabilitar RLS temporalmente en todas las tablas para desarrollo
-- NOTA: En producción, deberías usar políticas RLS apropiadas

-- Deshabilitar RLS en user_profiles
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en labs  
ALTER TABLE labs DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en reservations
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;

-- Verificar el estado de RLS
SELECT schemaname, tablename, rowsecurity, forcerowsecurity 
FROM pg_tables 
WHERE tablename IN ('user_profiles', 'labs', 'reservations');

-- Insertar algunos laboratorios de ejemplo si no existen
INSERT INTO labs (name, building, floor, capacity, equipment, features, status) VALUES
('Laboratorio de Física I', 'Edificio A', '2do Piso', 30, ARRAY['Osciloscopios', 'Multímetros', 'Fuentes de poder'], ARRAY['WiFi', 'Proyector', 'Aire acondicionado'], 'available'),
('Laboratorio de Química Orgánica', 'Edificio B', '1er Piso', 25, ARRAY['Campanas extractoras', 'Balanzas analíticas', 'Estufas'], ARRAY['Sistema de ventilación', 'Ducha de emergencia', 'WiFi'], 'available'),
('Laboratorio de Computación', 'Edificio C', '3er Piso', 40, ARRAY['PCs Intel i7', 'Software especializado', 'Servidores'], ARRAY['WiFi', 'Aire acondicionado', 'Proyector'], 'available'),
('Laboratorio de Microbiología', 'Edificio D', '2do Piso', 20, ARRAY['Microscopios', 'Autoclaves', 'Incubadoras'], ARRAY['Ambiente estéril', 'Control de temperatura', 'WiFi'], 'available')
ON CONFLICT (id) DO NOTHING; 