import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

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
  const [clientesDb, setClientesDb] = useState([]); // <--- NUEVO
  const [barberos] = useState(BARBEROS_STATIC);
  
  const { token, user } = useAuth();

  const authFetch = useCallback(async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };
    return fetch(`${API_URL}${endpoint}`, { ...options, headers });
  }, [token]);

  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      // Preparamos las peticiones base
      const requests = [
        authFetch('/citas'),
        authFetch('/servicios'),
        authFetch('/bloqueos')
      ];

      // Si es ADMIN, pedimos también los usuarios
      if (user && user.role === 'admin') {
        requests.push(authFetch('/users'));
      }

      const responses = await Promise.all(requests);
      
      if (responses[0].ok) {
        const data = await responses[0].json();
        setCitas(data.map(d => ({ ...d, id: d._id })));
      }

      if (responses[1].ok) {
        const data = await responses[1].json();
        setServicios(data.map(d => ({ ...d, id: d._id })));
      }

      if (responses[2].ok) {
        const data = await responses[2].json();
        setBloqueos(data.map(d => ({ ...d, id: d._id })));
      }

      // Procesar Usuarios (Solo si existe la respuesta y es ok)
      if (responses[3] && responses[3].ok) {
        const data = await responses[3].json();
        setClientesDb(data.map(d => ({ ...d, id: d._id })));
      }

    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }, [authFetch, token, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Helpers de Lectura ---
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

  // --- Funciones de Escritura ---
  const crearCita = async (nuevaCita) => {
    const res = await authFetch('/citas', { method: 'POST', body: JSON.stringify(nuevaCita) });
    if (!res.ok) throw new Error("Error al guardar cita");
    const data = await res.json();
    fetchData(); // Recargar
    return { ...data, id: data._id };
  };

  const actualizarEstadoCita = async (id, estado) => {
    setCitas(prev => prev.map(c => c.id === id ? { ...c, estado } : c)); // UI optimista
    await authFetch(`/citas/${id}`, { method: 'PUT', body: JSON.stringify({ estado }) });
    fetchData(); // Sincronizar
  };

  const crearBloqueo = async (bloqueo) => {
    const res = await authFetch('/bloqueos', { method: 'POST', body: JSON.stringify(bloqueo) });
    if (res.ok) fetchData();
  };

  const crearServicio = async (servicio) => {
    const res = await authFetch('/servicios', { method: 'POST', body: JSON.stringify(servicio) });
    if (res.ok) fetchData();
  };

  const actualizarServicio = async (id, datos) => {
    const res = await authFetch(`/servicios/${id}`, { method: 'PUT', body: JSON.stringify(datos) });
    if (res.ok) fetchData();
  };

  const eliminarServicio = async (id) => {
    await authFetch(`/servicios/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return {
    citas, barberos, bloqueos, servicios, clientesDb,
    getCitasPorFecha, getCitasCliente, isTimeBlocked,
    crearCita, actualizarEstadoCita,
    crearBloqueo, crearServicio, actualizarServicio, eliminarServicio,
    refetch: fetchData // <--- Exportamos refetch
  };
}