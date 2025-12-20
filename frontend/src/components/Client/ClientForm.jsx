// src/components/Client/ClientForm.jsx
import React, { useState } from 'react';

const ClientForm = ({ datosReserva, onConfirm, onBack }) => {
  // Estado local para los datos del cliente
  const [clienteData, setClienteData] = useState({
    nombre: '',
    telefono: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClienteData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, telefono, email } = clienteData;

    // Validación simple
    if (!nombre || !telefono || !email) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Llama a la función del controlador (ClientBooking)
    onConfirm(clienteData);
  };

  // Información de la reserva para el resumen final
  const { servicioNombre, fecha, hora } = datosReserva;
  
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Paso 3: Ingresa tus Datos Personales</h3>
      
      {/* Resumen de la Reserva */}
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderLeft: '3px solid #007bff' }}>
        <strong>Servicio:</strong> {servicioNombre}<br/>
        <strong>Fecha y Hora:</strong> {fecha} a las {hora}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="nombre">Nombre Completo:</label>
        <input 
          type="text" 
          id="nombre" 
          name="nombre" 
          value={clienteData.nombre} 
          onChange={handleChange} 
          required
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="telefono">Teléfono:</label>
        <input 
          type="tel" 
          id="telefono" 
          name="telefono" 
          value={clienteData.telefono} 
          onChange={handleChange} 
          required
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="email">Correo Electrónico:</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={clienteData.email} 
          onChange={handleChange} 
          required
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" onClick={onBack} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white' }}>
          Atrás
        </button>
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: 'green', color: 'white' }}>
          Confirmar Cita Ahora
        </button>
      </div>
    </form>
  );
};

export default ClientForm;