// src/containers/Admin/AdminDashboard.jsx

import React, { useState, useMemo } from 'react';
import { useCitas } from '../../hooks/useCitas';
import DailyAppointments from '../../components/Admin/DailyAppointments';
import TimeBlocker from '../../components/Admin/TimeBlocker';
import ServiceManager from '../../components/Admin/ServiceManager';
import DataWidget from '../../components/Admin/DataWidget'; 

function AdminDashboard() {
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

  // --- LÓGICA DE ESTADÍSTICAS ---
  const totalCitas = citas.length;
  const citasAceptadas = useMemo(() =>
    citas.filter(c => c.estado === 'confirmada' || c.estado === 'completada').length,
    [citas]
  );
  const citasRechazadas = useMemo(() =>
    citas.filter(c => c.estado === 'cancelada').length,
    [citas]
  );
  const totalServicios = servicios.length;
  const totalBarberos = barberos.length;
  const totalClientes = useMemo(() => {
    const uniqueEmails = new Set(citas.map(c => c.cliente.email));
    return uniqueEmails.size;
  }, [citas]);
  // -----------------------------

  const [fechaSeleccionada, setFechaSeleccionada] = useState('2025-12-15');
  const [filtroBarbero, setFiltroBarbero] = useState('all');
  const [filtroEstado, setFiltroEstado] = useState('all');

  const citasDelDiaFiltradas = useMemo(() => {
    let citasFiltradas = citas
      .filter(cita => cita.fecha === fechaSeleccionada)
      .sort((a, b) => a.hora.localeCompare(b.hora));

    if (filtroBarbero !== 'all') {
      citasFiltradas = citasFiltradas.filter(cita => cita.barberoId === filtroBarbero);
    }
    if (filtroEstado !== 'all') {
      citasFiltradas = citasFiltradas.filter(cita => cita.estado === filtroEstado);
    }
    return citasFiltradas;
  }, [citas, fechaSeleccionada, filtroBarbero, filtroEstado]);

  const handleUpdateStatus = (idCita, estado) => {
    actualizarEstadoCita(idCita, estado);
  };

  const handleBlockTime = (bloqueoData) => {
    crearBloqueo(bloqueoData);
  };

  const getBarberoNombre = (barberoId) => {
    const barbero = barberos.find(b => b.id === barberoId);
    return barbero ? barbero.nombre : 'Barbero No Asignado';
  };

  const ESTADOS_CITAS = ['pendiente', 'confirmada', 'completada', 'cancelada'];
  const fechasDeEjemplo = ['2025-12-15', '2025-12-16', '2025-12-17', '2025-12-18', '2025-12-19'];

  return (
    <div className="admin-dashboard">
      <h2>Panel de Control</h2>

      {/* Widgets de Estadísticas */}
      <div className="data-widget-grid">
        <DataWidget title="Total Clientes" value={totalClientes} colorClass="widget-clientes-total" />
        <DataWidget title="Total Citas" value={totalCitas} colorClass="widget-citas-total" />
        <DataWidget title="Citas Aceptadas" value={citasAceptadas} colorClass="widget-aceptadas" />
        <DataWidget title="Citas Rechazadas" value={citasRechazadas} colorClass="widget-rechazadas" />
        <DataWidget title="Total Servicios" value={totalServicios} colorClass="widget-servicios-total" />
        <DataWidget title="Total Barberos" value={totalBarberos} colorClass="widget-barberos-total" />
      </div>

      <ServiceManager
        servicios={servicios}
        onCreate={crearServicio}
        onUpdate={actualizarServicio}
        onDelete={eliminarServicio}
      />

      {/* --- AQUÍ ESTABA EL ERROR: Cambiado 'barbers' por 'barberos' --- */}
      <TimeBlocker 
        barberos={barberos}  
        onBlockTime={handleBlockTime} 
      />
      {/* --------------------------------------------------------------- */}

      {/* Navegación y Filtros */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid var(--border-color)', marginTop: '20px', borderRadius: 'var(--border-radius)', background: 'var(--bg-card)' }}>
        <h3 style={{fontSize: '1.1rem', marginBottom: '10px'}}>Navegación Semanal:</h3>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
            {fechasDeEjemplo.map(fecha => (
            <button
                key={fecha}
                onClick={() => setFechaSeleccionada(fecha)}
                className={fecha === fechaSeleccionada ? 'btn-primary-accent' : 'btn-secondary-nav'}
            >
                {fecha}
            </button>
            ))}
        </div>
      </div>

      <div className="filter-container">
        <div style={{ flex: 1 }}>
          <label htmlFor="filtroBarbero">Filtrar por Barbero:</label>
          <select
            id="filtroBarbero"
            value={filtroBarbero}
            onChange={(e) => setFiltroBarbero(e.target.value)}
          >
            <option value="all">Todos los Barberos</option>
            {barberos.map(b => (
              <option key={b.id} value={b.id}>{b.nombre}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="filtroEstado">Filtrar por Estado:</label>
          <select
            id="filtroEstado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
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

      <DailyAppointments
        fecha={fechaSeleccionada}
        citas={citasDelDiaFiltradas}
        onUpdateStatus={handleUpdateStatus}
        getBarberoNombre={getBarberoNombre}
      />

      <div className="card" style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Bloqueos Activos para el {fechaSeleccionada}:</h3>
          <ul style={{ paddingLeft: '20px' }}>
            {bloqueos
            .filter(b => b.fecha === fechaSeleccionada)
            .map(b => (
                <li key={b.id} style={{ marginBottom: '5px' }}>
                <strong>[{getBarberoNombre(b.barberoId)}]</strong> De {b.horaInicio} a {b.horaFin} ({b.motivo})
                </li>
            ))}
          </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;