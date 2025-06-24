-- Agregar más laboratorios a la base de datos
INSERT INTO labs (name, building, floor, capacity, equipment, features, status) VALUES

-- Laboratorios de Ingeniería Civil
('Laboratorio de Materiales de Construcción', 'Edificio A', '1er Piso', 35, 
 ARRAY['Máquinas de ensayo universal', 'Prensas hidráulicas', 'Equipos de granulometría', 'Balanzas de precisión'], 
 ARRAY['WiFi', 'Extractores de aire', 'Mesa de trabajo resistente'], 'available'),

('Laboratorio de Suelos y Pavimentos', 'Edificio A', '3er Piso', 25, 
 ARRAY['Equipos de compactación', 'Penetrómetros', 'Tamices normalizados', 'Hornos de secado'], 
 ARRAY['WiFi', 'Sistema de ventilación', 'Área de secado'], 'available'),

-- Laboratorios de Ingeniería Mecánica
('Laboratorio de Termodinámica', 'Edificio B', '2do Piso', 30, 
 ARRAY['Motores de combustión interna', 'Turbinas', 'Intercambiadores de calor', 'Manómetros digitales'], 
 ARRAY['WiFi', 'Sistema de ventilación especializado', 'Proyector', 'Aire acondicionado'], 'available'),

('Laboratorio de Resistencia de Materiales', 'Edificio B', '1er Piso', 28, 
 ARRAY['Máquinas de tracción', 'Extensómetros', 'Galgas de deformación', 'Microscopios metalográficos'], 
 ARRAY['WiFi', 'Iluminación especializada', 'Mesa antivibraciones'], 'available'),

('Laboratorio de Manufactura y CNC', 'Edificio B', 'Sótano', 20, 
 ARRAY['Tornos CNC', 'Fresadoras', 'Soldadoras', 'Instrumentos de medición'], 
 ARRAY['Extractores industriales', 'Sistemas de seguridad', 'Protección auditiva'], 'maintenance'),

-- Laboratorios de Ingeniería Eléctrica
('Laboratorio de Circuitos Eléctricos', 'Edificio C', '1er Piso', 32, 
 ARRAY['Fuentes de alimentación', 'Osciloscopios digitales', 'Generadores de señales', 'Multímetros'], 
 ARRAY['WiFi', 'Proyector', 'Aire acondicionado', 'Conexiones eléctricas seguras'], 'available'),

('Laboratorio de Máquinas Eléctricas', 'Edificio C', '2do Piso', 24, 
 ARRAY['Motores trifásicos', 'Generadores', 'Transformadores', 'Analizadores de redes'], 
 ARRAY['WiFi', 'Sistema de protección eléctrica', 'Ventilación forzada'], 'available'),

('Laboratorio de Control y Automatización', 'Edificio C', '3er Piso', 26, 
 ARRAY['PLCs Siemens', 'HMI touchscreen', 'Sensores industriales', 'Servomotores'], 
 ARRAY['WiFi', 'Proyector', 'Software especializado', 'Simuladores'], 'available'),

-- Laboratorios de Ingeniería Química
('Laboratorio de Operaciones Unitarias', 'Edificio D', '1er Piso', 22, 
 ARRAY['Columnas de destilación', 'Intercambiadores de calor', 'Bombas centrífugas', 'Medidores de flujo'], 
 ARRAY['Campanas extractoras', 'Ducha de emergencia', 'Sistema anti-incendios', 'WiFi'], 'available'),

('Laboratorio de Análisis Instrumental', 'Edificio D', '2do Piso', 18, 
 ARRAY['Espectrofotómetros', 'Cromatógrafos', 'pH-metros', 'Balanzas analíticas'], 
 ARRAY['Ambiente controlado', 'WiFi', 'Mesa antivibraciones', 'Control de humedad'], 'available'),

-- Laboratorios de Computación
('Laboratorio de Programación Avanzada', 'Edificio E', '2do Piso', 45, 
 ARRAY['PCs Intel i9', 'Monitores duales', 'IDEs especializados', 'Servidores Linux'], 
 ARRAY['WiFi', 'Aire acondicionado', 'Proyector 4K', 'Backup eléctrico'], 'available'),

('Laboratorio de Inteligencia Artificial', 'Edificio E', '3er Piso', 35, 
 ARRAY['Workstations GPU', 'Clusters de cómputo', 'TPUs', 'Almacenamiento NAS'], 
 ARRAY['WiFi', 'Refrigeración especializada', 'Monitoreo 24/7'], 'available'),

('Laboratorio de Redes y Telecomunicaciones', 'Edificio E', '1er Piso', 30, 
 ARRAY['Switches Cisco', 'Routers', 'Analizadores de protocolo', 'Cables de fibra óptica'], 
 ARRAY['WiFi', 'Proyector', 'Rack de equipos', 'Sistema de gestión de cables'], 'occupied'),

-- Laboratorios especializados
('Laboratorio de Robótica', 'Edificio F', '1er Piso', 25, 
 ARRAY['Brazos robóticos', 'Sensores LIDAR', 'Cámaras de visión', 'Microcontroladores'], 
 ARRAY['WiFi', 'Mesa de trabajo modular', 'Sistema de seguridad', 'Iluminación LED'], 'available'),

('Laboratorio de Energías Renovables', 'Edificio F', 'Azotea', 20, 
 ARRAY['Paneles solares', 'Aerogeneradores', 'Inversores', 'Baterías de almacenamiento'], 
 ARRAY['Acceso exterior', 'Monitoreo climático', 'WiFi', 'Protección UV'], 'available')

ON CONFLICT (id) DO NOTHING; 