interface EmailData {
  to: string
  subject: string
  userName: string
  labName: string
  reservationDate: string
  startTime: string
  endTime: string
  purpose: string
  studentCount: number
  reservationId: number
}

// Simular el envío de email con notificación visual al usuario
export const sendReservationApprovalEmail = async (data: EmailData): Promise<boolean> => {
  console.log('📧 SISTEMA DE EMAILS ACTIVADO')
  console.log('=' .repeat(50))
  
  // Simular proceso de envío
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const emailContent = `
📧 EMAIL ENVIADO EXITOSAMENTE
===============================

Para: ${data.to}
Asunto: ${data.subject}

Estimado/a ${data.userName},

¡Su reserva ha sido APROBADA automáticamente! 🎉

📋 DETALLES DE SU RESERVA:
• Laboratorio: ${data.labName}
• Fecha: ${new Date(data.reservationDate).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  })}
• Horario: ${data.startTime} - ${data.endTime}
• Propósito: ${data.purpose}
• Número de estudiantes: ${data.studentCount}
• ID de Reserva: #${data.reservationId}

📍 INSTRUCCIONES:
1. Llegue 10 minutos antes de la hora programada
2. Presente este comprobante al encargado del laboratorio
3. Verifique el estado del equipamiento al iniciar
4. Registre cualquier incidencia en la bitácora

📞 CONTACTO:
- Laboratorios FIEE: lab-fiee@uni.edu.pe
- Emergencias: +51 1 481-1070 ext. 2156

Atentamente,
Sistema Automatizado de Reservas
Facultad de Ingeniería Eléctrica, Electrónica y Telecomunicaciones
Universidad Nacional de Ingeniería

⚠️  IMPORTANTE: Conserve este email como comprobante
`

  console.log(emailContent)
  console.log('=' .repeat(50))
  console.log('✅ EMAIL ENVIADO CORRECTAMENTE')
  
  // Mostrar notificación visual al usuario si es posible
  if (typeof window !== 'undefined') {
    // Crear una notificación visual en el navegador
    showEmailNotification(data)
  }
  
  return true
}

// Función para mostrar notificación visual en el navegador
const showEmailNotification = (data: EmailData) => {
  // Crear un elemento de notificación temporal
  const notification = document.createElement('div')
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 9999;
      max-width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
    ">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 18px; margin-right: 8px;">📧</span>
        <strong>Email de Confirmación Enviado</strong>
      </div>
      <div>
        Tu reserva para <strong>${data.labName}</strong> ha sido aprobada.
        <br>
        <small>Revisa tu email: ${data.to}</small>
      </div>
    </div>
  `
  
  document.body.appendChild(notification)
  
  // Quitar la notificación después de 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 5000)
  
  // Hacer que la notificación sea clickeable para cerrarla
  notification.addEventListener('click', () => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  })
}

// Función para enviar email de cancelación
export const sendReservationCancellationEmail = async (data: EmailData): Promise<boolean> => {
  console.log('📧 EMAIL DE CANCELACIÓN')
  console.log('=' .repeat(50))
  
  const emailContent = `
📧 EMAIL ENVIADO - RESERVA CANCELADA
===================================

Para: ${data.to}
Asunto: Reserva Cancelada - ${data.labName}

Estimado/a ${data.userName},

Su reserva ha sido CANCELADA exitosamente.

📋 DETALLES DE LA RESERVA CANCELADA:
• Laboratorio: ${data.labName}
• Fecha: ${new Date(data.reservationDate).toLocaleDateString('es-ES')}
• Horario: ${data.startTime} - ${data.endTime}
• ID de Reserva: #${data.reservationId}

La reserva ya no está activa en el sistema.

Si necesita realizar una nueva reserva, puede hacerlo a través del sistema.

Atentamente,
Sistema de Reservas - FIEE
Universidad Nacional de Ingeniería
`

  console.log(emailContent)
  console.log('✅ EMAIL DE CANCELACIÓN ENVIADO')
  
  if (typeof window !== 'undefined') {
    showCancellationNotification(data)
  }
  
  return true
}

// Notificación visual para cancelación
const showCancellationNotification = (data: EmailData) => {
  const notification = document.createElement('div')
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 9999;
      max-width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
    ">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 18px; margin-right: 8px;">❌</span>
        <strong>Reserva Cancelada</strong>
      </div>
      <div>
        Tu reserva para <strong>${data.labName}</strong> ha sido cancelada.
        <br>
        <small>Email de confirmación enviado a: ${data.to}</small>
      </div>
    </div>
  `
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 4000)
  
  notification.addEventListener('click', () => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  })
} 