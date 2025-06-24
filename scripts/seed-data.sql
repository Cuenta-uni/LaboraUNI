-- Insert sample labs
INSERT INTO labs (name, building, floor, capacity, equipment, features, status) VALUES
('Laboratorio de Física I', 'Edificio A', '2do Piso', 30, 
 ARRAY['Osciloscopios', 'Multímetros', 'Fuentes de poder'], 
 ARRAY['WiFi', 'Proyector', 'Aire acondicionado'], 'available'),

('Laboratorio de Química Orgánica', 'Edificio B', '1er Piso', 25, 
 ARRAY['Campanas extractoras', 'Balanzas analíticas', 'Estufas'], 
 ARRAY['Sistema de ventilación', 'Ducha de emergencia', 'WiFi'], 'occupied'),

('Laboratorio de Computación', 'Edificio C', '3er Piso', 40, 
 ARRAY['PCs Intel i7', 'Software especializado', 'Servidores'], 
 ARRAY['WiFi', 'Aire acondicionado', 'Proyector'], 'available'),

('Laboratorio de Microbiología', 'Edificio D', '2do Piso', 20, 
 ARRAY['Microscopios', 'Autoclaves', 'Incubadoras'], 
 ARRAY['Ambiente estéril', 'Control de temperatura', 'WiFi'], 'maintenance'),

('Laboratorio de Electrónica', 'Edificio E', '1er Piso', 35, 
 ARRAY['Protoboards', 'Componentes electrónicos', 'Soldadores'], 
 ARRAY['WiFi', 'Extractor de humos', 'Proyector'], 'available'),

('Laboratorio de Materiales', 'Edificio F', '3er Piso', 28, 
 ARRAY['Máquina universal', 'Durómetros', 'Microscopios metalográficos'], 
 ARRAY['Aire acondicionado', 'WiFi', 'Sistema de seguridad'], 'available');
