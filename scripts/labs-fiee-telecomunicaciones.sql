-- Laboratorios específicos para la Facultad de Ingeniería Eléctrica, Electrónica y Telecomunicaciones
-- Universidad Nacional de Ingeniería (UNI)

-- Limpiar laboratorios existentes si es necesario
-- DELETE FROM labs WHERE id > 0;

-- Insertar laboratorios específicos de la FIEE
INSERT INTO labs (name, building, floor, capacity, equipment, features, status) VALUES

-- === LABORATORIOS DE CIRCUITOS Y FUNDAMENTOS ===
('Laboratorio de Circuitos Eléctricos I', 'Edificio FIEE', '1er Piso', 30, 
 ARRAY['Fuentes de voltaje DC', 'Multímetros digitales', 'Protoboards', 'Resistencias variables', 'Capacitores', 'Inductores'], 
 ARRAY['WiFi', 'Proyector', 'Aire acondicionado', 'Conexiones eléctricas seguras'], 'available'),

('Laboratorio de Circuitos Eléctricos II', 'Edificio FIEE', '1er Piso', 30, 
 ARRAY['Fuentes AC/DC', 'Osciloscopios digitales', 'Generadores de funciones', 'Analizadores de impedancia', 'Transformadores didácticos'], 
 ARRAY['WiFi', 'Sistema de protección eléctrica', 'Bancas antiestáticas'], 'available'),

-- === LABORATORIOS DE ELECTRÓNICA ===
('Laboratorio de Electrónica Analógica', 'Edificio FIEE', '2do Piso', 25, 
 ARRAY['Amplificadores operacionales', 'Transistores BJT y MOSFET', 'Diodos semiconductores', 'Osciloscopios 100MHz', 'Analizadores de espectro'], 
 ARRAY['WiFi', 'Ventilación especializada', 'Estaciones de soldadura', 'Control de temperatura'], 'available'),

('Laboratorio de Electrónica Digital', 'Edificio FIEE', '2do Piso', 25, 
 ARRAY['Compuertas lógicas TTL/CMOS', 'Microcontroladores PIC/Arduino', 'FPGA Xilinx', 'Analizadores lógicos', 'Programadores universales'], 
 ARRAY['WiFi', 'Software de simulación', 'Proyector', 'Estaciones ESD'], 'available'),

('Laboratorio de Microcontroladores y Sistemas Embebidos', 'Edificio FIEE', '3er Piso', 20, 
 ARRAY['Arduino Uno/Mega', 'Raspberry Pi 4', 'ESP32/ESP8266', 'Sensores IoT', 'Actuadores servo', 'Displays LCD/OLED'], 
 ARRAY['WiFi', 'Conexión a Internet', 'Estaciones de desarrollo', 'Kits de prototipado'], 'available'),

-- === LABORATORIOS DE MÁQUINAS ELÉCTRICAS ===
('Laboratorio de Máquinas Eléctricas DC', 'Edificio FIEE', '3er Piso', 20, 
 ARRAY['Motores DC de diversas potencias', 'Generadores DC', 'Dinamómetros', 'Fuentes de alimentación trifásicas', 'Tacómetros digitales'], 
 ARRAY['Sistema de protección eléctrica', 'Ventilación forzada', 'Medidores de torque'], 'available'),

('Laboratorio de Máquinas Eléctricas AC', 'Edificio FIEE', '3er Piso', 20, 
 ARRAY['Motores trifásicos', 'Transformadores monofásicos/trifásicos', 'Alternadores síncronos', 'Analizadores de calidad de energía'], 
 ARRAY['Sistema trifásico 220V/380V', 'Protecciones eléctricas', 'Ventilación industrial'], 'available'),

-- === LABORATORIOS DE CONTROL Y AUTOMATIZACIÓN ===
('Laboratorio de Control Automático', 'Edificio FIEE', '4to Piso', 24, 
 ARRAY['PLCs Siemens S7-1200', 'HMI Siemens', 'Variadores de frecuencia', 'Sensores industriales', 'Válvulas electroneumáticas'], 
 ARRAY['WiFi', 'Software TIA Portal', 'Simuladores de procesos', 'Red industrial'], 'available'),

('Laboratorio de Robótica Industrial', 'Edificio FIEE', '4to Piso', 18, 
 ARRAY['Brazo robótico ABB', 'Controladores robóticos', 'Sensores de visión artificial', 'Sistemas de coordenadas', 'Grippers neumáticos'], 
 ARRAY['WiFi', 'Software RobotStudio', 'Área de seguridad', 'Iluminación LED especializada'], 'available'),

-- === LABORATORIOS DE TELECOMUNICACIONES ===
('Laboratorio de Telecomunicaciones I', 'Edificio FIEE', '5to Piso', 26, 
 ARRAY['Generadores de RF', 'Analizadores de espectro RF', 'Medidores de potencia', 'Antenas didácticas', 'Cables coaxiales'], 
 ARRAY['WiFi', 'Cámara anecoica pequeña', 'Instrumentación RF', 'Proyector'], 'available'),

('Laboratorio de Comunicaciones Digitales', 'Edificio FIEE', '5to Piso', 26, 
 ARRAY['SDR (Software Defined Radio)', 'Analizadores de protocolos', 'Moduladores/Demoduladores', 'BERT (Bit Error Rate Tester)'], 
 ARRAY['WiFi', 'Software GNU Radio', 'Simuladores de canal', 'Estaciones de trabajo'], 'available'),

('Laboratorio de Fibra Óptica', 'Edificio FIEE', '5to Piso', 20, 
 ARRAY['Fusionadora de fibra óptica', 'OTDR', 'Medidor de potencia óptica', 'Fibras monomodo/multimodo', 'Conectores SC/LC/ST'], 
 ARRAY['Mesa antivibraciones', 'Control de partículas', 'Iluminación especializada', 'Kit de limpieza óptica'], 'available'),

-- === LABORATORIOS DE REDES Y SISTEMAS ===
('Laboratorio de Redes de Computadoras', 'Edificio FIEE', '6to Piso', 30, 
 ARRAY['Switches Cisco 2960', 'Routers Cisco 2911', 'Access Points WiFi', 'Analizadores de tráfico Wireshark', 'Cables UTP Cat6'], 
 ARRAY['WiFi', 'Rack de equipos', 'Sistema de gestión de cables', 'Simulador Packet Tracer'], 'available'),

('Laboratorio de Sistemas de Telecomunicaciones', 'Edificio FIEE', '6to Piso', 24, 
 ARRAY['Central telefónica IP', 'Gateway VoIP', 'Teléfonos IP', 'Analizadores de QoS', 'Servidores de comunicaciones'], 
 ARRAY['WiFi', 'Red VoIP dedicada', 'Monitoreo 24/7', 'Sistema de grabación'], 'available'),

-- === LABORATORIOS ESPECIALIZADOS ===
('Laboratorio de Instrumentación Electrónica', 'Edificio FIEE', '7mo Piso', 22, 
 ARRAY['Osciloscopios 1GHz', 'Analizadores de impedancia', 'Medidores LCR', 'Fuentes programables', 'Calibradores multifunción'], 
 ARRAY['Mesa antivibraciones', 'Control de temperatura/humedad', 'Blindaje electromagnético'], 'available'),

('Laboratorio de Compatibilidad Electromagnética (EMC)', 'Edificio FIEE', 'Sótano', 15, 
 ARRAY['Cámara anecoica', 'Generadores de interferencia', 'Analizadores EMI/EMC', 'Antenas de medición', 'Mesa de pruebas'], 
 ARRAY['Blindaje total', 'Control de acceso', 'Certificación EMC', 'Aire acondicionado especializado'], 'available'),

('Laboratorio de Alta Tensión', 'Edificio FIEE', 'Azotea', 12, 
 ARRAY['Transformador de prueba 100kV', 'Generador Marx', 'Esfera de descarga', 'Divisores de tensión', 'Protecciones'], 
 ARRAY['Área aislada', 'Sistema de seguridad', 'Pararrayos', 'Señalización de peligro'], 'maintenance'),

-- === LABORATORIOS DE INVESTIGACIÓN ===
('Laboratorio de Procesamiento Digital de Señales', 'Edificio FIEE', '8vo Piso', 18, 
 ARRAY['DSP TI C6000', 'MATLAB/Simulink', 'Tarjetas de adquisición', 'Generadores de señales arbitrarias', 'Analizadores FFT'], 
 ARRAY['WiFi', 'Workstations especializadas', 'Software licensed', 'Aire acondicionado'], 'available'),

('Laboratorio de Energías Renovables', 'Edificio FIEE', 'Azotea', 16, 
 ARRAY['Paneles solares monocristalinos', 'Inversores grid-tie', 'Controladores MPPT', 'Baterías de almacenamiento', 'Aerogenerador didáctico'], 
 ARRAY['Acceso exterior', 'Monitoreo climático', 'Protección UV', 'Sistema de monitoreo remoto'], 'available')

ON CONFLICT (id) DO NOTHING; 