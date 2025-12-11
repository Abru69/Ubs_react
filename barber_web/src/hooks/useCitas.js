// src/hooks/useCitas.js

import { useState } from 'react';

// =======================================================
// MOCK DATA (Simulando nuestra "Base de Datos" - MODELO)
// =======================================================

const BARBEROS_INICIALES = [
  { id: 'b1', nombre: 'Carlos', especialidad: 'Clásico y Barba' },
  { id: 'b2', nombre: 'Andrés', especialidad: 'Moderno y Diseños' },
  { id: 'b3', nombre: 'Sofia', especialidad: 'Estilos Femeninos' },
];

const SERVICIOS_INICIALES = [
  { id: 's1', nombre: 'Corte Clásico', duracion: 45, precio: 15 },
  { id: 's2', nombre: 'Arreglo de Barba', duracion: 30, precio: 10 },
  { id: 's3', nombre: 'Corte + Barba', duracion: 75, precio: 25 },
];

const CITAS_INICIALES = [
  { 
    id: 'c1', 
    cliente: { nombre: 'Elena Gómez', telefono: '555-1001', email: 'elena@mail.com' }, 
    barberoId: 'b1', 
    servicio: 'Corte Clásico', // Usar nombre de servicio para mostrar en el cliente
    fecha: '2025-12-15', 
    hora: '09:00', 
    estado: 'pendiente'
  },
  { 
    id: 'c2', 
    cliente: { nombre: 'Ricardo Solis', telefono: '555-1002', email: 'ricardo@mail.com' }, 
    barberoId: 'b2', 
    servicio: 'Arreglo de Barba', 
    fecha: '2025-12-15', 
    hora: '10:30', 
    estado: 'confirmada' 
  },
  { 
    id: 'c3', 
    cliente: { nombre: 'Maria Paz', telefono: '555-1003', email: 'maria@mail.com' }, 
    barberoId: 'b1', 
    servicio: 'Corte Clásico', 
    fecha: '2025-12-16', 
    hora: '14:00', 
    estado: 'pendiente' 
  },
];

const BLOQUEOS_INICIALES = [
  { 
    id: 'b-lunch-1', 
    barberoId: 'b1', 
    fecha: '2025-12-16', 
    horaInicio: '12:00', 
    horaFin: '13:00', 
    motivo: 'Almuerzo' 
  },
];


// =======================================================
// CUSTOM HOOK (Controlador)
// =======================================================

export function useCitas() {
  const [citas, setCitas] = useState(CITAS_INICIALES);
  const [barberos] = useState(BARBEROS_INICIALES); 
  const [bloqueos, setBloqueos] = useState(BLOQUEOS_INICIALES);
  const [servicios, setServicios] = useState(SERVICIOS_INICIALES); // Estado de Servicios

  // --- Lógica de Citas (CRUD y Consultas) ---

  const getCitasPorFecha = (fecha) => {
    return citas.filter(cita => cita.fecha === fecha);
  };
  
  const crearCita = (nuevaCita) => {
    const newId = 'c' + (citas.length + 1 + Math.floor(Math.random() * 100)); 
    const citaConId = { 
      ...nuevaCita, 
      id: newId, 
      estado: 'confirmada' 
    };
    
    setCitas(prevCitas => [...prevCitas, citaConId]);
    return citaConId;
  };

  const actualizarEstadoCita = (idCita, nuevoEstado) => {
    setCitas(prevCitas =>
      prevCitas.map(cita =>
        cita.id === idCita ? { ...cita, estado: nuevoEstado } : cita
      )
    );
  };
  
  // --- Lógica de Bloqueos ---

  const crearBloqueo = (nuevoBloqueo) => {
    const newId = 'block-' + (bloqueos.length + 1 + Math.floor(Math.random() * 100)); 
    const bloqueoConId = { 
      ...nuevoBloqueo, 
      id: newId, 
    };
    
    setBloqueos(prevBloqueos => [...prevBloqueos, bloqueoConId]);
    return bloqueoConId;
  };

  const isTimeBlocked = (barberoId, fecha, hora) => {
      // Comprueba si la hora cae dentro de un bloqueo activo
      return bloqueos.some(bloqueo => 
          bloqueo.barberoId === barberoId &&
          bloqueo.fecha === fecha &&
          bloqueo.horaInicio <= hora && 
          bloqueo.horaFin > hora
      );
  };

  // --- Lógica de Servicios (CRUD) ---
  
  const crearServicio = (nuevoServicio) => {
    const newId = 's' + (servicios.length + 1 + Math.floor(Math.random() * 100));
    const servicioConId = { ...nuevoServicio, id: newId };
    setServicios(prev => [...prev, servicioConId]);
  };

  const actualizarServicio = (id, datosActualizados) => {
    setServicios(prev => prev.map(s => 
        s.id === id ? { ...s, ...datosActualizados } : s
    ));
  };

  const eliminarServicio = (id) => {
    setServicios(prev => prev.filter(s => s.id !== id));
  };


  // Exportamos todo el estado y la lógica de manipulación
  return {
    citas,
    barberos,
    bloqueos,
    servicios,
    getCitasPorFecha,
    crearCita,
    actualizarEstadoCita,
    crearBloqueo,
    isTimeBlocked,
    crearServicio,
    actualizarServicio,
    eliminarServicio,
  };
}