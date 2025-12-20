// src/components/Client/ServiceBarberSelector.jsx
import React, { useState } from 'react';

const ServiceBarberSelector = ({ servicios, barberos, onNext }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);

  const handleSubmit = () => {
    if (selectedService && selectedBarber) {
      onNext({
        servicioId: selectedService.id,
        barberoId: selectedBarber,
        servicioNombre: selectedService.nombre,
      });
    } else {
      alert('Por favor, selecciona un servicio y un barbero.');
    }
  };

  return (
    <div>
      <h4>1. Elige tu Servicio:</h4>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        {servicios.map(s => (
          <button
            key={s.id}
            style={{ 
              padding: '10px', 
              border: `2px solid ${selectedService?.id === s.id ? 'blue' : '#ccc'}`, 
              cursor: 'pointer' 
            }}
            onClick={() => setSelectedService(s)}
          >
            {s.nombre} (${s.precio})
          </button>
        ))}
      </div>

      <h4>2. Elige tu Barbero:</h4>
      <select 
        onChange={(e) => setSelectedBarber(e.target.value)} 
        value={selectedBarber || ''}
      >
        <option value="" disabled>Selecciona un barbero</option>
        <option value="any">Cualquiera (Recomendado)</option>
        {barberos.map(b => (
          <option key={b.id} value={b.id}>
            {b.nombre} ({b.especialidad})
          </option>
        ))}
      </select>
      
      <button 
        onClick={handleSubmit} 
        disabled={!selectedService || !selectedBarber}
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'green', color: 'white' }}
      >
        Siguiente
      </button>
    </div>
  );
};

export default ServiceBarberSelector;