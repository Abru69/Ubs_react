// src/components/Admin/ServiceManager.jsx
import React, { useState, useEffect } from 'react';

const emptyService = { nombre: '', duracion: 45, precio: 20 };

const ServiceManager = ({ servicios, onCreate, onUpdate, onDelete }) => {
  const [currentService, setCurrentService] = useState(emptyService);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setCurrentService(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) : value 
    }));
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      onUpdate(currentService.id, currentService);
    } else {
      onCreate(currentService);
    }
    setCurrentService(emptyService);
    setIsEditing(false);
  };

  return (
    <div style={{ margin: '20px 0', border: '1px solid #0056b3', padding: '20px', borderRadius: '5px' }}>
      <h4>⚙️ Gestión de Servicios y Precios</h4>
      
      {/* Formulario de Creación/Edición */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
        <input 
          type="text" 
          name="nombre" 
          placeholder="Nombre del Servicio" 
          value={currentService.nombre} 
          onChange={handleChange} 
          required
        />
        <input 
          type="number" 
          name="duracion" 
          placeholder="Duración (min)" 
          value={currentService.duracion} 
          onChange={handleChange} 
          min="15"
          required
        />
        <input 
          type="number" 
          name="precio" 
          placeholder="Precio ($)" 
          value={currentService.precio} 
          onChange={handleChange} 
          min="5"
          required
        />
        <button type="submit" style={{ backgroundColor: isEditing ? 'darkgreen' : '#007bff', color: 'white' }}>
          {isEditing ? 'Guardar Cambios' : 'Añadir Nuevo Servicio'}
        </button>
        {isEditing && (
            <button type="button" onClick={() => { setIsEditing(false); setCurrentService(emptyService); }} style={{ backgroundColor: 'gray', color: 'white' }}>
                Cancelar Edición
            </button>
        )}
      </form>
      
      {/* Lista de Servicios */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px' }}>
        {servicios.map(s => (
          <div key={s.id} style={{ border: '1px solid #ccc', padding: '10px', width: '250px', borderRadius: '5px' }}>
            <strong>{s.nombre}</strong>
            <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
              ${s.precio} | {s.duracion} min
            </p>
            <button onClick={() => handleEdit(s)} style={{ marginRight: '5px' }}>Editar</button>
            <button onClick={() => onDelete(s.id)} style={{ backgroundColor: 'red', color: 'white' }}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceManager;