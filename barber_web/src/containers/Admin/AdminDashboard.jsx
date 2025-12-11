// src/containers/Admin/AdminDashboard.jsx

import React, { useState, useMemo } from 'react';
import { useCitas } from '../../hooks/useCitas'; 
import DailyAppointments from '../../components/Admin/DailyAppointments';
import TimeBlocker from '../../components/Admin/TimeBlocker'; 
import ServiceManager from '../../components/Admin/ServiceManager'; 

function AdminDashboard() {
  
  // Desestructuramos todo lo que necesitamos del Modelo/Controlador
  const { 
    citas, 
    barberos, 
    bloqueos, 
    servicios,
    actualizarEstadoCita, 
    crearBloqueo, 
    crearServicio, 
    actualizarServicio, 
    eliminarServicio 
  } = useCitas();
  
  // Estado para la fecha seleccionada
  const [fechaSeleccionada, setFechaSeleccionada] = useState('2025-12-15'); 
  
  // ***************** NUEVOS ESTADOS DE FILTRO *****************
  const [filtroBarbero, setFiltroBarbero] = useState('all'); 
  const [filtroEstado, setFiltroEstado] = useState('all');   
  // ************************************************************

  // CONTROLADOR: Prepara los datos aplicando todos los filtros
  const citasDelDiaFiltradas = useMemo(() => {
    
    // 1. Filtrar por fecha
    let citasFiltradas = citas
      .filter(cita => cita.fecha === fechaSeleccionada)
      .sort((a, b) => a.hora.localeCompare(b.hora));

    // 2. Filtrar por Barbero
    if (filtroBarbero !== 'all') {
      citasFiltradas = citasFiltradas.filter(cita => cita.barberoId === filtroBarbero);
    }

    // 3. Filtrar por Estado
    if (filtroEstado !== 'all') {
      citasFiltradas = citasFiltradas.filter(cita => cita.estado === filtroEstado);
    }
    
    return citasFiltradas;
  }, [citas, fechaSeleccionada, filtroBarbero, filtroEstado]); 
  
  // CONTROLADOR: Maneja la acción del barbero para cambiar el estado de la cita
  const handleUpdateStatus = (idCita, estado) => {
    actualizarEstadoCita(idCita, estado); 
  };
  
  // CONTROLADOR: Maneja la creación de un nuevo bloqueo (soluciona el error 'handleBlockTime is not defined')
  const handleBlockTime = (bloqueoData) => {
    crearBloqueo(bloqueoData); 
  };

  // Función de ayuda para obtener el nombre del barbero
  const getBarberoNombre = (barberoId) => {
      const barbero = barberos.find(b => b.id === barberoId);
      return barbero ? barbero.nombre : 'Barbero No Asignado';
  };
  
  // Lista de estados para el filtro
  const ESTADOS_CITAS = ['pendiente', 'confirmada', 'completada', 'cancelada'];
  
  // Generamos un array de fechas simuladas para la navegación semanal
  const fechasDeEjemplo = ['2025-12-15', '2025-12-16', '2025-12-17', '2025-12-18', '2025-12-19'];
  
  return (
    <div className="admin-dashboard">
      <h1>Dashboard del Barbero</h1>
      
      
      {/* VISTA Y CONTROLADOR DE GESTIÓN DE SERVICIOS */}
      <ServiceManager
        servicios={servicios}
        onCreate={crearServicio}
        onUpdate={actualizarServicio}
        onDelete={eliminarServicio}
      />
      
      {/* VISTA Y CONTROLADOR DE BLOQUEOS */}
      <TimeBlocker 
        barberos={barberos} 
        onBlockTime={handleBlockTime} 
      />

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

      {/* ***************** NUEVA VISTA DE FILTROS ***************** */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
        
        {/* Filtro por Barbero */}
        <div>
          <label htmlFor="filtroBarbero">Filtrar por Barbero:</label>
          <select 
            id="filtroBarbero" 
            value={filtroBarbero} 
            onChange={(e) => setFiltroBarbero(e.target.value)}
            style={{ padding: '8px', marginLeft: '10px' }}
          >
            <option value="all">Todos los Barberos</option>
            {barberos.map(b => (
              <option key={b.id} value={b.id}>{b.nombre}</option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado */}
        <div>
          <label htmlFor="filtroEstado">Filtrar por Estado:</label>
          <select 
            id="filtroEstado" 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ padding: '8px', marginLeft: '10px' }}
          >
            <option value="all">Todos los Estados</option>
            {ESTADOS_CITAS.map(estado => (
              <option key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* ************************************************************ */}

      {/* VISTA: Citas del Día Seleccionado (Usa las citas filtradas) */}
      <DailyAppointments
        fecha={fechaSeleccionada}
        citas={citasDelDiaFiltradas} 
        onUpdateStatus={handleUpdateStatus}
        getBarberoNombre={getBarberoNombre}
      />
      
      {/* Visualización de bloques creados para la fecha actual */}
      <h3 style={{ marginTop: '30px' }}>Bloqueos Activos para el {fechaSeleccionada}:</h3>
      <ul>
        {bloqueos
          .filter(b => b.fecha === fechaSeleccionada)
          .map(b => (
            <li key={b.id}>
              [{getBarberoNombre(b.barberoId)}] De {b.horaInicio} a {b.horaFin} ({b.motivo})
            </li>
          ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;