// src/components/Client/TimeSelector.jsx
import React, { useState, useEffect } from 'react';

// Función utilitaria para obtener la fecha de mañana (para empezar)
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

const TimeSelector = ({ datosReserva, getDisponibilidad, onNext, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(getTomorrowDate());
  const [selectedTime, setSelectedTime] = useState(null);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  
  const barberoNombre = datosReserva.barberoId === 'any' 
    ? 'Cualquier Barbero' 
    : datosReserva.barberoId; // Mostraría el ID por ahora, lo mejoramos después.

  useEffect(() => {
    // Si elegió "cualquiera", la disponibilidad es más compleja.
    // Por simplicidad, si seleccionó un barbero, llamamos a la lógica.
    if (datosReserva.barberoId && selectedDate) {
      // El controlador nos da las horas libres
      const disponibles = getDisponibilidad(datosReserva.barberoId, selectedDate);
      setHorasDisponibles(disponibles);
      setSelectedTime(null); // Resetear hora al cambiar fecha
    }
  }, [selectedDate, datosReserva.barberoId, getDisponibilidad]);

  const handleSubmit = () => {
    if (selectedTime) {
      onNext({
        fecha: selectedDate,
        hora: selectedTime,
      });
    } else {
      alert('Por favor, selecciona una hora.');
    }
  };

  return (
    <div>
      <h4>Servicio: **{datosReserva.servicioNombre}**</h4>
      <h4>Barbero seleccionado: **{barberoNombre}**</h4>

      <h4>1. Elige la Fecha:</h4>
      <input 
        type="date" 
        value={selectedDate} 
        min={getTomorrowDate()} // Solo se puede reservar a partir de mañana
        onChange={(e) => setSelectedDate(e.target.value)} 
      />

      <h4>2. Elige la Hora Disponible:</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {horasDisponibles.length > 0 ? (
          horasDisponibles.map(hora => (
            <button
              key={hora}
              style={{ 
                padding: '8px', 
                border: `1px solid ${selectedTime === hora ? 'darkblue' : '#888'}`, 
                backgroundColor: selectedTime === hora ? 'lightblue' : 'white',
                cursor: 'pointer' 
              }}
              onClick={() => setSelectedTime(hora)}
            >
              {hora}
            </button>
          ))
        ) : (
          <p>No hay horarios disponibles para esta fecha. Intenta otro día.</p>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={onBack} style={{ marginRight: '10px' }}>Atrás</button>
        <button 
          onClick={handleSubmit} 
          disabled={!selectedTime}
          style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white' }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TimeSelector;