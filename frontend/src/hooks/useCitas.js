import { useState, useEffect, useCallback } from 'react';

// URL de tu Backend
const API_URL = 'http://localhost:5000/api';

const BARBEROS_STATIC = [
  { id: 'b1', nombre: 'Carlos', especialidad: 'Clásico y Barba' },
  { id: 'b2', nombre: 'Andrés', especialidad: 'Moderno y Diseños' },
  { id: 'b3', nombre: 'Sofia', especialidad: 'Estilos Femeninos' },
];

export function useCitas() {
  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [bloqueos, setBloqueos] = useState([]);
  const [barberos] = useState(BARBEROS_STATIC);

  // --- FUNCIÓN PARA CARGAR DATOS DEL SERVIDOR ---
  const fetchData = useCallback(async () => {
    try {
      const [resCitas, resServicios, resBloqueos] = await Promise.all([
        fetch(`${API_URL}/citas`),
        fetch(`${API_URL}/servicios`),
        fetch(`${API_URL}/bloqueos`)
      ]);

      const dataCitas = await resCitas.json();
      const dataServicios = await resServicios.json();
      const dataBloqueos = await resBloqueos.json();

      // Mapeamos _id de Mongo a id para que el frontend no se rompa
      setCitas(dataCitas.map(d => ({ ...d, id: d._id })));
      setServicios(dataServicios.map(d => ({ ...d, id: d._id })));
      setBloqueos(dataBloqueos.map(d => ({ ...d, id: d._id })));
    } catch (error) {
      console.error("Error conectando al backend:", error);
    }
  }, []);

  // Cargar datos al iniciar
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- LÓGICA DE LECTURA ---
  const getCitasPorFecha = (fecha) => citas.filter(c => c.fecha === fecha);
  
  const getCitasCliente = (email) => {
    return citas
      .filter(c => c.cliente.email === email)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  };

  const isTimeBlocked = (barberoId, fecha, hora) => {
    return bloqueos.some(b => 
      b.barberoId === barberoId && b.fecha === fecha &&
      b.horaInicio <= hora && b.horaFin > hora
    );
  };

  // --- LÓGICA DE ESCRITURA (CON FETCH) ---

  const crearCita = async (nuevaCita) => {
    const res = await fetch(`${API_URL}/citas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaCita)
    });
    const data = await res.json();
    const citaFinal = { ...data, id: data._id };
    setCitas(prev => [...prev, citaFinal]);
    return citaFinal;
  };

  const actualizarEstadoCita = async (id, estado) => {
    // Optimistic UI update (actualiza visualmente antes de esperar al server)
    setCitas(prev => prev.map(c => c.id === id ? { ...c, estado } : c));
    
    await fetch(`${API_URL}/citas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    });
  };

  const crearBloqueo = async (bloqueo) => {
    const res = await fetch(`${API_URL}/bloqueos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bloqueo)
    });
    const data = await res.json();
    setBloqueos(prev => [...prev, { ...data, id: data._id }]);
  };

  const crearServicio = async (servicio) => {
    const res = await fetch(`${API_URL}/servicios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servicio)
    });
    const data = await res.json();
    setServicios(prev => [...prev, { ...data, id: data._id }]);
  };

  const actualizarServicio = async (id, datos) => {
    const res = await fetch(`${API_URL}/servicios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    const data = await res.json();
    setServicios(prev => prev.map(s => s.id === id ? { ...data, id: data._id } : s));
  };

  const eliminarServicio = async (id) => {
    await fetch(`${API_URL}/servicios/${id}`, { method: 'DELETE' });
    setServicios(prev => prev.filter(s => s.id !== id));
  };

  return {
    citas, barberos, bloqueos, servicios,
    getCitasPorFecha, getCitasCliente, isTimeBlocked,
    crearCita, actualizarEstadoCita,
    crearBloqueo,
    crearServicio, actualizarServicio, eliminarServicio
  };
}