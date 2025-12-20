import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyAppointments = ({ citas, onCancel, getBarberoNombre }) => {
  const navigate = useNavigate();
  const hoy = new Date().toISOString().split('T')[0];

  // Función auxiliar para saber si una fecha ya pasó
  const isPast = (fecha, hora) => {
    const citaDate = new Date(`${fecha}T${hora}`);
    const now = new Date();
    return citaDate < now;
  };

  return (
    <div className="my-appointments">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>📅 Historial de Reservas</h3>
          <button onClick={() => navigate('/reservar')} className="btn-primary-accent" style={{ fontSize: '0.9em' }}>
            + Nueva Cita
          </button>
      </div>
      
      {citas.length === 0 ? (
        <div style={{textAlign: 'center', padding: '30px', border: '1px dashed #ccc', borderRadius: '8px', color: '#666'}}>
          <p>Aún no tienes citas registradas.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {citas.map(cita => {
            const pasada = isPast(cita.fecha, cita.hora);
            const cancelada = cita.estado === 'cancelada';
            const activa = !pasada && !cancelada;

            return (
              <div key={cita.id} className="card" style={{ 
                  borderLeft: `5px solid ${activa ? 'green' : (cancelada ? 'red' : 'gray')}`,
                  padding: '15px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  
                  {/* Detalles de la Cita */}
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-primary)' }}>{cita.servicio}</h4>
                    <span style={{ fontSize: '0.95em', color: '#555' }}>
                      📅 <strong>{cita.fecha}</strong> a las <strong>{cita.hora}</strong>
                    </span>
                    <br/>
                    <small style={{ color: '#777' }}>Barbero: {getBarberoNombre(cita.barberoId)}</small>
                  </div>

                  {/* Estado y Acciones */}
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                    <span className={`status-badge ${cita.estado}`} style={{ marginBottom: '5px' }}>
                        {cita.estado.toUpperCase()}
                    </span>
                    
                    {/* Botón Cancelar solo si está activa */}
                    {activa && (
                        <button 
                          onClick={() => {
                            if(window.confirm('¿Estás seguro de cancelar esta cita?')) onCancel(cita.id);
                          }} 
                          style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}
                        >
                          Cancelar Cita
                        </button>
                    )}
                    
                    {/* Botón Reagendar si está cancelada o pasada */}
                    {(!activa) && (
                        <button 
                          onClick={() => navigate('/reservar')}
                          style={{ background: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}
                        >
                          Volver a Reservar
                        </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;