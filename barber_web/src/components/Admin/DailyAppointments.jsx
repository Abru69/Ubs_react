// src/components/Admin/DailyAppointments.jsx
import React from 'react';

const DailyAppointments = ({ fecha, citas, onUpdateStatus, getBarberoNombre }) => {
  return (
    <div>
      <h2>Citas para el **{fecha}** ({citas.length} total)</h2>
      
      {citas.length === 0 ? (
        <p>🎉 ¡Día libre! No hay citas programadas para esta fecha.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {citas.map(cita => (
            <div 
              key={cita.id} 
              style={{ 
                border: `2px solid ${cita.estado === 'completada' ? 'green' : (cita.estado === 'cancelada' ? 'red' : 'orange')}`,
                padding: '15px',
                borderRadius: '8px',
                width: '300px'
              }}
            >
              <h4>🕒 {cita.hora} - {cita.servicio}</h4>
              <p>
                **Cliente:** {cita.cliente.nombre}<br/>
                **Barbero:** {getBarberoNombre(cita.barberoId)}<br/>
                **Estado Actual:** <strong style={{ textTransform: 'uppercase' }}>{cita.estado}</strong>
              </p>
              
              {/* CONTROLADOR (Botones de acción) */}
              <div style={{ marginTop: '10px' }}>
                {cita.estado !== 'completada' && (
                  <button 
                    onClick={() => onUpdateStatus(cita.id, 'completada')}
                    style={{ backgroundColor: 'green', color: 'white', marginRight: '5px' }}
                  >
                    Marcar Completada
                  </button>
                )}
                
                {cita.estado !== 'cancelada' && cita.estado !== 'completada' && (
                  <button 
                    onClick={() => onUpdateStatus(cita.id, 'cancelada')}
                    style={{ backgroundColor: 'red', color: 'white' }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyAppointments;