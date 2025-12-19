import { useState, useEffect } from 'react';

// =======================================================
// DATOS INICIALES (Por si el LocalStorage está vacío)
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
  // Puedes dejar esto vacío [] si prefieres empezar de cero
];

// =======================================================
// HOOK PRINCIPAL
// =======================================================

export function useCitas() {
  // 1. Cargar Estados desde LocalStorage
  const [citas, setCitas] = useState(() => {
    const saved = localStorage.getItem('ubs_citas');
    return saved ? JSON.parse(saved) : CITAS_INICIALES;
  });

  const [barberos] = useState(BARBEROS_INICIALES); 

  const [bloqueos, setBloqueos] = useState(() => {
    const saved = localStorage.getItem('ubs_bloqueos');
    return saved ? JSON.parse(saved) : [];
  });

  const [servicios, setServicios] = useState(() => {
    const saved = localStorage.getItem('ubs_servicios');
    return saved ? JSON.parse(saved) : SERVICIOS_INICIALES;
  });

  // 2. Guardar en LocalStorage ante cualquier cambio
  useEffect(() => {
    localStorage.setItem('ubs_citas', JSON.stringify(citas));
    localStorage.setItem('ubs_servicios', JSON.stringify(servicios));
    localStorage.setItem('ubs_bloqueos', JSON.stringify(bloqueos));
  }, [citas, servicios, bloqueos]);

  // --- Funciones de Lectura ---

  const getCitasPorFecha = (fecha) => {
    return citas.filter(cita => cita.fecha === fecha);
  };

  // NUEVO: Obtener citas de un cliente específico (para el Portal Cliente)
  const getCitasCliente = (email) => {
    return citas
      .filter(c => c.cliente.email === email)
      .sort((a, b) => {
         // Ordenar: Las más recientes/futuras primero
         const dateA = new Date(`${a.fecha}T${a.hora}`);
         const dateB = new Date(`${b.fecha}T${b.hora}`);
         return dateB - dateA;
      });
  };

  // --- Funciones de Escritura (Citas) ---
  
  const crearCita = (nuevaCita) => {
    const newId = 'c' + Math.floor(Math.random() * 100000); 
    const citaConId = { 
      ...nuevaCita, 
      id: newId, 
      estado: 'confirmada' 
    };
    setCitas(prev => [...prev, citaConId]);
    return citaConId;
  };

  const actualizarEstadoCita = (idCita, nuevoEstado) => {
    setCitas(prev =>
      prev.map(cita =>
        cita.id === idCita ? { ...cita, estado: nuevoEstado } : cita
      )
    );
  };
  
  // --- Funciones de Bloqueos ---

  const crearBloqueo = (nuevoBloqueo) => {
    const newId = 'block-' + Math.floor(Math.random() * 10000); 
    const bloqueoConId = { ...nuevoBloqueo, id: newId };
    setBloqueos(prev => [...prev, bloqueoConId]);
  };

  const isTimeBlocked = (barberoId, fecha, hora) => {
      return bloqueos.some(bloqueo => 
          bloqueo.barberoId === barberoId &&
          bloqueo.fecha === fecha &&
          bloqueo.horaInicio <= hora && 
          bloqueo.horaFin > hora
      );
  };

  // --- Funciones de Servicios ---
  
  const crearServicio = (nuevo) => {
    const newId = 's' + Math.floor(Math.random() * 10000);
    setServicios(prev => [...prev, { ...nuevo, id: newId }]);
  };

  const actualizarServicio = (id, datos) => {
    setServicios(prev => prev.map(s => s.id === id ? { ...s, ...datos } : s));
  };

  const eliminarServicio = (id) => {
    setServicios(prev => prev.filter(s => s.id !== id));
  };

  return {
    citas, barberos, bloqueos, servicios,
    getCitasPorFecha, getCitasCliente, // <--- EXPORTADO
    crearCita, actualizarEstadoCita,
    crearBloqueo, isTimeBlocked,
    crearServicio, actualizarServicio, eliminarServicio,
  };
}