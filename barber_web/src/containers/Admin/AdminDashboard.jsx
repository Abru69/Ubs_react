// src/containers/Admin/AdminDashboard.jsx
import React, { useState, useMemo } from 'react';
import { useCitas } from '../../hooks/useCitas'; // MODELO y CONTROLADOR de datos
import DailyAppointments from '../../components/Admin/DailyAppointments';
import { getBarberName } from '../../utils/utils'; // Una función de ayuda que crearemos

function AdminDashboard() {
  const { citas, barberos, actualizarEstadoCita } = useCitas();
  const [fechaSeleccionada, setFechaSeleccionada] = useState('2025-12-15'); // Fecha inicial de ejemplo

  // CONTROLADOR: Prepara los datos para la vista
  // En un entorno real, la API nos daría las citas de la semana actual.
  // Aquí usamos las citas hardcodeadas en useCitas.js.
  const citasDelDia = useMemo(() => {
    return citas
      .filter(cita => cita.fecha === fechaSeleccionada)
      // Opcional: ordenar por hora
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }, [citas, fechaSeleccionada]);
  
  // CONTROLADOR: Maneja la acción del barbero para cambiar el estado de la cita
  const handleUpdateStatus = (idCita, estado) => {
    // LLAMADA AL MODELO para actualizar el estado
    actualizarEstadoCita(idCita, estado);
  };

  // Función de ayuda para obtener el nombre del barbero
  const getBarberoNombre = (barberoId) => {
      const barbero = barberos.find(b => b.id === barberoId);
      return barbero ? barbero.nombre : 'Barbero No Encontrado';
  };

  // Generamos un array de fechas simuladas para la navegación semanal
  const fechasDeEjemplo = ['2025-12-15', '2025-12-16', '2025-12-17', '2025-12-18', '2025-12-19'];
  
  return (
    <div className="admin-dashboard">
      <h1>Dashboard del Barbero</h1>
      
      {/* VISTA: Navegación Semanal */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
        <h3>Navegación Semanal:</h3>
        {fechasDeEjemplo.map(fecha => (
          <button
            key={fecha}
            onClick={() => setFechaSeleccionada(fecha)}
            style={{ 
              marginRight: '10px', 
              padding: '8px',
              backgroundColor: fecha === fechaSeleccionada ? '#007bff' : '#f8f9fa',
              color: fecha === fechaSeleccionada ? 'white' : 'black',
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
          >
            {fecha}
          </button>
        ))}
      </div>

      {/* VISTA: Citas del Día Seleccionado */}
      <DailyAppointments
        fecha={fechaSeleccionada}
        citas={citasDelDia}
        onUpdateStatus={handleUpdateStatus}
        getBarberoNombre={getBarberoNombre}
      />
      
      {/* Visualización de la arquitectura (Ayuda visual) */}
      

    </div>
  );
}

export default AdminDashboard;