import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useCitas } from '../../hooks/useCitas';
import DataWidget from '../../components/Admin/DataWidget'; 
import DailyAppointments from '../../components/Admin/DailyAppointments';
import ServiceManager from '../../components/Admin/ServiceManager';
import TimeBlocker from '../../components/Admin/TimeBlocker';

function AdminDashboard() {
  const { view } = useParams(); // Detecta si es 'citas', 'servicios' o 'clientes'
  const {
    citas, barberos, servicios, bloqueos,
    actualizarEstadoCita, crearBloqueo, crearServicio, actualizarServicio, eliminarServicio
  } = useCitas();

  // Lógica para Clientes Únicos
  const clientesUnicos = useMemo(() => {
    const map = new Map();
    citas.forEach(c => {
      if (!map.has(c.cliente.email)) {
        map.set(c.cliente.email, { 
          ...c.cliente, 
          totalCitas: 1, 
          ultimaCita: c.fecha 
        });
      } else {
        const existing = map.get(c.cliente.email);
        existing.totalCitas += 1;
        if (c.fecha > existing.ultimaCita) existing.ultimaCita = c.fecha;
      }
    });
    return Array.from(map.values());
  }, [citas]);

  const getBarberoNombre = (id) => barberos.find(b => b.id === id)?.nombre || 'Sin asignar';

  // --- RENDERS DE VISTAS ---

  const renderDashboardPrincipal = () => (
    <>
      <div className="data-widget-grid">
        <DataWidget title="Total Citas" value={citas.length} colorClass="widget-citas-total" />
        <DataWidget title="Clientes" value={clientesUnicos.length} colorClass="widget-clientes-total" />
        <DataWidget title="Servicios" value={servicios.length} colorClass="widget-servicios-total" />
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Citas de Hoy</h3>
        <DailyAppointments 
          fecha={new Date().toISOString().split('T')[0]} 
          citas={citas.filter(c => c.fecha === new Date().toISOString().split('T')[0])} 
          onUpdateStatus={actualizarEstadoCita} 
          getBarberoNombre={getBarberoNombre} 
        />
      </div>
    </>
  );

  const renderTodasLasCitas = () => (
    <div className="card">
      <h3>Historial Completo de Citas</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Fecha/Hora</th>
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Barbero</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map(c => (
            <tr key={c.id}>
              <td>{c.fecha} - {c.hora}</td>
              <td>{c.cliente.nombre}<br/><small>{c.cliente.telefono}</small></td>
              <td>{c.servicio}</td>
              <td>{getBarberoNombre(c.barberoId)}</td>
              <td><span className={`status-badge ${c.estado}`}>{c.estado}</span></td>
              <td>
                <button onClick={() => actualizarEstadoCita(c.id, 'completada')} className="btn-small green">✓</button>
                <button onClick={() => actualizarEstadoCita(c.id, 'cancelada')} className="btn-small red">X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderClientes = () => (
    <div className="card">
      <h3>Base de Datos de Clientes</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Total Visitas</th>
            <th>Última Visita</th>
          </tr>
        </thead>
        <tbody>
          {clientesUnicos.map(cli => (
            <tr key={cli.email}>
              <td><strong>{cli.nombre}</strong></td>
              <td>{cli.email}<br/>{cli.telefono}</td>
              <td>{cli.totalCitas}</td>
              <td>{cli.ultimaCita}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-dashboard-container">
      <h2>Panel: {view ? view.toUpperCase() : 'GENERAL'}</h2>
      
      {!view && renderDashboardPrincipal()}
      {view === 'citas' && renderTodasLasCitas()}
      {view === 'servicios' && (
        <>
          <ServiceManager servicios={servicios} onCreate={crearServicio} onUpdate={actualizarServicio} onDelete={eliminarServicio} />
          <TimeBlocker barberos={barberos} onBlockTime={crearBloqueo} />
        </>
      )}
      {view === 'clientes' && renderClientes()}
    </div>
  );
}

export default AdminDashboard;