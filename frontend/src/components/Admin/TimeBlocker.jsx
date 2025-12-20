// src/components/Admin/TimeBlocker.jsx
import React, { useState } from 'react';

const TimeBlocker = ({ barberos, onBlockTime }) => {
  const [bloqueoData, setBloqueoData] = useState({
    barberoId: barberos[0]?.id || '', // Seleccionar el primer barbero por defecto
    fecha: '',
    horaInicio: '12:00',
    horaFin: '13:00',
    motivo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBloqueoData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bloqueoData.fecha && bloqueoData.barberoId) {
      onBlockTime(bloqueoData); // Llama a la función del CONTROLADOR (AdminDashboard)
      setBloqueoData(prev => ({ ...prev, fecha: '', motivo: '' })); // Resetear campos
    } else {
      alert('Por favor, selecciona barbero y fecha.');
    }
  };

  return (
    <div style={{ border: '1px dashed orange', padding: '15px', marginBottom: '30px' }}>
      <h4>🔒 Bloquear Horario Personal / Descanso</h4>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr', gap: '10px' }}>
        
        <select name="barberoId" value={bloqueoData.barberoId} onChange={handleChange} required>
          {barberos.map(b => (
            <option key={b.id} value={b.id}>{b.nombre}</option>
          ))}
        </select>
        
        <input type="date" name="fecha" value={bloqueoData.fecha} onChange={handleChange} required />
        
        <input type="time" name="horaInicio" value={bloqueoData.horaInicio} onChange={handleChange} required />
        
        <input type="time" name="horaFin" value={bloqueoData.horaFin} onChange={handleChange} required />
        
        <input type="text" name="motivo" placeholder="Motivo (Ej: Almuerzo, Cita)" value={bloqueoData.motivo} onChange={handleChange} required />

        <button type="submit" style={{ gridColumn: 'span 5', backgroundColor: 'darkorange', color: 'white', padding: '10px' }}>
          Bloquear Tiempo
        </button>
      </form>
    </div>
  );
};

export default TimeBlocker;