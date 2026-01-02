import React, { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCitas } from '../../hooks/useCitas';
import DataWidget from '../../components/Admin/DataWidget'; 
import DailyAppointments from '../../components/Admin/DailyAppointments';
import ServiceManager from '../../components/Admin/ServiceManager';
import TimeBlocker from '../../components/Admin/TimeBlocker';

function AdminDashboard() {
  const { view } = useParams();
  const {
    citas, barberos, servicios, clientesDb,
    actualizarEstadoCita, crearBloqueo, crearServicio, actualizarServicio, eliminarServicio,
    refetch 
  } = useCitas();

  // --- AUTO-RECARGA DE DATOS (Notificaciones) ---
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Auto-recargando datos...");
      refetch();
    }, 30000); // Cada 30 segundos
    return () => clearInterval(interval);
  }, [refetch]);

  // --- CALCULOS ---
  const citasPendientes = useMemo(() => citas.filter(c => c.estado === 'pendiente').length, [citas]);

  const totalVentas = useMemo(() => {
    return citas
      .filter(c => c.estado === 'completada')
      .reduce((total, cita) => {
        const servicioInfo = servicios.find(s => s.nombre === cita.servicio);
        return total + (servicioInfo ? servicioInfo.precio : 0);
      }, 0);
  }, [citas, servicios]);

  const getBarberoNombre = (id) => barberos.find(b => b.id === id)?.nombre || 'Sin asignar';

  // --- RENDERS ---

  const renderDashboardPrincipal = () => (
    <>
      {/* Alerta de Nuevas Citas */}
      {citasPendientes > 0 && (
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
          🔔 <strong>Atención:</strong> Tienes {citasPendientes} cita(s) pendiente(s) de atender.
        </div>
      )}

      <div className="data-widget-grid">
        <DataWidget title="Citas Pendientes" value={citasPendientes} colorClass="widget-citas-total" />
        <DataWidget title="Ingresos Totales" value={`$${totalVentas}`} colorClass="widget-servicios-total" />
        <DataWidget title="Usuarios Registrados" value={clientesDb.length} colorClass="widget-clientes-total" />
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Agenda de Hoy</h3>
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
      <h3>Historial Completo</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Barbero</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map(c => (
            <tr key={c.id} style={{ backgroundColor: c.estado === 'pendiente' ? '#fff9e6' : 'transparent' }}>
              <td>{c.fecha} <br/> <strong>{c.hora}</strong></td>
              <td>{c.cliente.nombre}</td>
              <td>{c.servicio}</td>
              <td>{getBarberoNombre(c.barberoId)}</td>
              <td><span className={`status-badge ${c.estado}`}>{c.estado}</span></td>
              <td>
                <button onClick={() => actualizarEstadoCita(c.id, 'completada')} className="btn-small green" title="Completar">✓</button>
                <button onClick={() => actualizarEstadoCita(c.id, 'cancelada')} className="btn-small red" title="Cancelar">X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderClientes = () => (
    <div className="card">
      <h3>Base de Datos de Usuarios (Registrados)</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {clientesDb.length > 0 ? clientesDb.map(user => (
            <tr key={user._id || user.id}>
              <td><strong>{user.nombre}</strong></td>
              <td>{user.email}</td>
              <td>{user.telefono}</td>
              <td>{user.role}</td>
            </tr>
          )) : (
            <tr><td colSpan="4" style={{textAlign: 'center'}}>No hay usuarios registrados aún.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Panel: {view ? view.toUpperCase() : 'GENERAL'}</h2>
        <button onClick={() => refetch()} className="btn-small" style={{ marginBottom: '10px' }}>↻ Recargar Datos</button>
      </div>
      
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