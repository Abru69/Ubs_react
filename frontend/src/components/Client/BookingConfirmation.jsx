// src/components/Client/BookingConfirmation.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookingConfirmation = ({ mensaje, datosReserva }) => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '30px', border: '2px solid green', borderRadius: '10px', backgroundColor: '#e6ffe6' }}>
      <h2>✅ ¡Cita Confirmada con Éxito!</h2>
      <p style={{ fontSize: '1.1em', color: 'green' }}>{mensaje}</p>

      <div style={{ margin: '30px 0', textAlign: 'left', display: 'inline-block', padding: '15px', backgroundColor: 'white', borderRadius: '5px', border: '1px solid #ddd' }}>
        <h4>Detalles de tu Reserva:</h4>
        <p><strong>Servicio:</strong> {datosReserva.servicioNombre}</p>
        <p><strong>Barbero ID:</strong> {datosReserva.barberoId === 'any' ? 'Cualquiera' : datosReserva.barberoId}</p>
        <p><strong>Fecha:</strong> {datosReserva.fecha}</p>
        <p><strong>Hora:</strong> {datosReserva.hora}</p>
        <p>Te contactaremos a **{datosReserva.cliente.email}**</p>
      </div>
      
      <p>¡Esperamos verte en Unidos Barber Shop!</p>
      
      <button 
        onClick={() => navigate('/')}
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white' }}
      >
        Volver a la Página Principal
      </button>
    </div>
  );
};

export default BookingConfirmation;