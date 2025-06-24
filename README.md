# 🔬 Sistema de Reserva de Laboratorios - FIEE

## 📋 Descripción
Sistema web para la gestión y reserva de laboratorios de la **Facultad de Ingeniería Eléctrica, Electrónica y Telecomunicaciones (FIEE)** de la Universidad Nacional de Ingeniería.

## 🏛️ Facultad de Ingeniería Eléctrica, Electrónica y Telecomunicaciones

### Especialidades que Atiende:
- **Ingeniería Eléctrica**: Máquinas eléctricas, alta tensión, sistemas de potencia
- **Ingeniería Electrónica**: Circuitos analógicos/digitales, microcontroladores, instrumentación
- **Ingeniería de Telecomunicaciones**: Comunicaciones, redes, fibra óptica, RF

### 🔬 Laboratorios Disponibles (20 laboratorios especializados):

#### **Circuitos y Fundamentos (1er Piso)**
- Laboratorio de Circuitos Eléctricos I
- Laboratorio de Circuitos Eléctricos II

#### **Electrónica (2do-3er Piso)**
- Laboratorio de Electrónica Analógica
- Laboratorio de Electrónica Digital
- Laboratorio de Microcontroladores y Sistemas Embebidos

#### **Máquinas Eléctricas (3er Piso)**
- Laboratorio de Máquinas Eléctricas DC
- Laboratorio de Máquinas Eléctricas AC

#### **Control y Automatización (4to Piso)**
- Laboratorio de Control Automático
- Laboratorio de Robótica Industrial

#### **Telecomunicaciones (5to Piso)**
- Laboratorio de Telecomunicaciones I
- Laboratorio de Comunicaciones Digitales
- Laboratorio de Fibra Óptica

#### **Redes y Sistemas (6to Piso)**
- Laboratorio de Redes de Computadoras
- Laboratorio de Sistemas de Telecomunicaciones

#### **Laboratorios Especializados (7mo Piso, Sótano, Azotea)**
- Laboratorio de Instrumentación Electrónica
- Laboratorio de Compatibilidad Electromagnética (EMC)
- Laboratorio de Alta Tensión

#### **Investigación (8vo Piso, Azotea)**
- Laboratorio de Procesamiento Digital de Señales
- Laboratorio de Energías Renovables

## ⚡ Características del Sistema

### 🔐 **Autenticación**
- Registro con código universitario UNI
- Diferenciación entre estudiantes y profesores
- Registro específico por facultad

### 📅 **Gestión de Reservas**
- **Estudiantes**: Pueden ver laboratorios y horarios disponibles
- **Profesores**: Pueden crear, editar y eliminar reservas
- Validaciones de fecha/hora (solo futuras)
- Verificación automática de conflictos de horario

### 🤖 **Sistema de Auto-Aprobación**
- Las reservas se aprueban automáticamente después de **10 segundos**
- Email de confirmación automático (simulado)
- Notificaciones en tiempo real

### 📊 **Calendario Integrado**
- Vista semanal de todas las reservas
- Filtrado por laboratorio
- Diferenciación visual entre reservas propias y de otros
- Actualización en tiempo real

### 📈 **Estadísticas en Tiempo Real**
- Total de reservas por estado
- Tasa de aprobación del sistema
- Actualización automática cada 30 segundos

## 🛠️ **Stack Tecnológico**

### **Frontend**
- **Next.js 14** (App Router)
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Shadcn/ui** para componentes
- **Lucide React** para iconos

### **Backend**
- **Supabase** (PostgreSQL + Auth + Realtime)
- **Row Level Security (RLS)** deshabilitado para desarrollo
- **PostgreSQL Functions** para lógica de negocio
- **Triggers** para auto-aprobación

### **Base de Datos**
```sql
-- Tablas principales
- user_profiles (perfiles de usuario)
- labs (laboratorios con equipamiento)
- reservations (reservas con estados)
- reservation_approvals (aprobaciones automáticas)
```

## 🚀 **Instalación y Configuración**

### 1. **Clonar el Repositorio**
```bash
git clone <repository-url>
cd uni-lab-booking
```

### 2. **Instalar Dependencias**
```bash
npm install
# o
pnpm install
```

### 3. **Configurar Variables de Entorno**
Crear archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. **Configurar Base de Datos**
Ejecutar scripts SQL en orden:
```bash
# 1. Crear tablas
psql -f scripts/create-tables.sql

# 2. Agregar laboratorios específicos de FIEE
psql -f scripts/labs-fiee-telecomunicaciones.sql

# 3. Configurar sistema de auto-aprobación
psql -f scripts/auto-approval-system.sql

# 4. Deshabilitar RLS para desarrollo
psql -f scripts/fix-reservations-rls.sql
```

### 5. **Ejecutar en Desarrollo**
```bash
npm run dev
# o
pnpm dev
```

## 👥 **Tipos de Usuario**

### **Estudiantes**
- Ver laboratorios disponibles y sus equipos
- Ver calendario de reservas
- Ver estadísticas del sistema
- Solo lectura de reservas

### **Profesores**
- Todas las funciones de estudiantes
- **Crear** nuevas reservas de laboratorio
- **Editar** sus propias reservas
- **Eliminar** sus reservas
- Gestión completa del sistema

## 🔧 **Funcionalidades Avanzadas**

### **Validaciones Inteligentes**
- No permite reservas en fechas pasadas
- No permite horas pasadas en el día actual
- Verifica que hora_inicio < hora_fin
- Detecta conflictos de horario automáticamente

### **Sistema de Tiempo Real**
- **Supabase Realtime** para actualizaciones automáticas
- El calendario se actualiza sin refrescar cuando:
  - Se crea una nueva reserva
  - Se aprueba automáticamente una reserva
  - Otro usuario hace cambios

### **Auto-Aprobación Inteligente**
```typescript
// Proceso automático después de 10 segundos exactos
setTimeout(() => {
  approveReservation(reservationId)
  sendConfirmationEmail(userEmail, reservationDetails)
  notifyRealtimeUpdate()
}, 10000)
```

## 📧 **Sistema de Emails (Simulado)**
Cuando una reserva se aprueba automáticamente, se simula el envío de un email con:
- Detalles del laboratorio reservado
- Fecha y hora de la reserva
- Equipamiento disponible
- Instrucciones de acceso
- Información de contacto

## 🔄 **Estados de Reserva**
- **`pending`**: Reserva creada, esperando aprobación automática
- **`approved`**: Reserva aprobada y confirmada
- **`cancelled`**: Reserva cancelada por el usuario
- **`completed`**: Reserva que ya se realizó

## 📱 **Responsividad**
- Diseño completamente responsivo
- Optimizado para desktop, tablet y móvil
- Interfaz moderna con Tailwind CSS
- Componentes accesibles con Shadcn/ui

## 🎯 **Próximas Mejoras**
- [ ] Notificaciones push reales
- [ ] Sistema de emails real (SendGrid/Nodemailer)
- [ ] Reportes de uso de laboratorios
- [ ] Sistema de calificación de laboratorios
- [ ] Integración con calendario institucional
- [ ] App móvil nativa

## 📝 **Contribución**
Sistema desarrollado específicamente para la **FIEE - UNI** con laboratorios y equipamiento reales de la facultad.

---

**Desarrollado para la Facultad de Ingeniería Eléctrica, Electrónica y Telecomunicaciones**  
*Universidad Nacional de Ingeniería - Lima, Perú* 🇵🇪 