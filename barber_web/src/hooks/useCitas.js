import { useState } from 'react';

// =======================================================
// MOCK DATA (Simulando nuestra "Base de Datos" - MODELO)
// =======================================================

// Datos de los barberos
const BARBEROS_INICIALES = [
  { id: 'b1', nombre: 'Carlos', especialidad: 'Clásico y Barba' },
  { id: 'b2', nombre: 'Andrés', especialidad: 'Moderno y Diseños' },
  { id: 'b3', nombre: 'Sofia', especialidad: 'Estilos Femeninos' },
];

// Datos iniciales de citas. Usamos fechas futuras para simular la semana de trabajo.
// (Ej: 15 y 16 de Diciembre de 2025)
const CITAS_INICIALES = [
  { 
    id: 'c1', 
    cliente: { nombre: 'Elena Gómez', telefono: '555-1001' }, 
    barberoId: 'b1', 
    servicio: 'Corte', 
    fecha: '2025-12-15', 
    hora: '09:00', 
    estado: 'pendiente' // Para el barbero: pendiente de atender
  },
  { 
    id: 'c2', 
    cliente: { nombre: 'Ricardo Solis', telefono: '555-1002' }, 
    barberoId: 'b2', 
    servicio: 'Barba', 
    fecha: '2025-12-15', 
    hora: '10:30', 
    estado: 'confirmada' // Para el cliente: confirmada
  },
  { 
    id: 'c3', 
    cliente: { nombre: 'Maria Paz', telefono: '555-1003' }, 
    barberoId: 'b1', 
    servicio: 'Corte y Barba', 
    fecha: '2025-12-16', 
    hora: '14:00', 
    estado: 'pendiente' 
  },
];


// =======================================================
// CUSTOM HOOK (Nuestro principal Controlador)
// =======================================================

/**
 * Hook personalizado para manejar el estado y la lógica de las citas.
 * Actúa como el punto de acceso entre la Vista (componentes) y el Modelo (datos).
 */
export function useCitas() {
  const [citas, setCitas] = useState(CITAS_INICIALES);
  // Los barberos son fijos por ahora
  const [barberos] = useState(BARBEROS_INICIALES); 

  /**
   * Obtiene las citas filtradas por una fecha específica (e.g., para el dashboard del admin).
   * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'.
   * @returns {Array} Lista de citas para esa fecha.
   */
  const getCitasPorFecha = (fecha) => {
    return citas.filter(cita => cita.fecha === fecha);
  };
  
  /**
   * Obtiene las citas de un barbero específico.
   * @param {string} barberoId - ID del barbero.
   * @returns {Array} Lista de citas del barbero.
   */
  const getCitasPorBarbero = (barberoId) => {
      return citas.filter(cita => cita.barberoId === barberoId);
  };

  /**
   * Crea una nueva cita (usada por el cliente).
   * @param {object} nuevaCita - Datos de la cita a crear.
   * @returns {object} La cita creada (incluyendo el nuevo ID).
   */
  const crearCita = (nuevaCita) => {
    // Generación simple de ID (en un proyecto real usaríamos un UUID)
    const newId = 'c' + (citas.length + 1 + Math.floor(Math.random() * 100)); 
    const citaConId = { 
      ...nuevaCita, 
      id: newId, 
      // Las citas creadas por el cliente siempre inician como 'confirmada' o 'pendiente'
      estado: 'confirmada' 
    };
    
    setCitas(prevCitas => [...prevCitas, citaConId]);
    console.log(`Cita creada: ${citaConId.id}`);
    return citaConId;
  };

  /**
   * Actualiza el estado de una cita (usada por el barbero para marcar como 'completada').
   * @param {string} idCita - ID de la cita a modificar.
   * @param {string} nuevoEstado - Nuevo estado ('completada', 'cancelada', 'ausente', etc.).
   */
  const actualizarEstadoCita = (idCita, nuevoEstado) => {
    setCitas(prevCitas =>
      prevCitas.map(cita =>
        cita.id === idCita ? { ...cita, estado: nuevoEstado } : cita
      )
    );
    console.log(`Cita ${idCita} actualizada a estado: ${nuevoEstado}`);
  };

  // Exponemos los datos y las funciones que los componentes necesitarán
  return {
    citas,
    barberos,
    getCitasPorFecha,
    getCitasPorBarbero,
    crearCita,
    actualizarEstadoCita,
  };
}