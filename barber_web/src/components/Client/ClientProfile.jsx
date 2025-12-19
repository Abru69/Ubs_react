import React, { useState } from 'react';

const ClientProfile = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: user.nombre || '',
    telefono: user.telefono || '',
    email: user.email || '',
    password: '' 
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Actualizamos perfil (simulado)
    onUpdate({
        nombre: formData.nombre,
        telefono: formData.telefono
    });
    setMensaje('✅ Datos actualizados correctamente');
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="client-profile">
      <h3>👤 Editar Mis Datos</h3>
      
      {mensaje && (
          <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '4px', textAlign: 'center' }}>
            {mensaje}
          </div>
      )}
      
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre Completo</label>
          <input 
            type="text" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Teléfono</label>
          <input 
            type="tel" 
            name="telefono" 
            value={formData.telefono} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Correo Electrónico</label>
          <input 
            type="email" 
            value={formData.email} 
            disabled 
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: '#f0f0f0', color: '#777' }}
          />
          <small style={{color: '#999'}}>El correo no se puede cambiar.</small>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Dejar en blanco para mantener la misma" 
            value={formData.password} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <button type="submit" className="btn-primary-accent" style={{ width: '100%', padding: '12px' }}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default ClientProfile;