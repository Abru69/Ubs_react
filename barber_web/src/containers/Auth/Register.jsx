import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', telefono: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData);
  };

  return (
    <div className="booking-form-container card">
      <h2 style={{ textAlign: 'center' }}>Crear Cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Nombre Completo</label>
          <input type="text" onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Teléfono</label>
          <input type="tel" onChange={(e) => setFormData({...formData, telefono: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Correo Electrónico</label>
          <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Contraseña</label>
          <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        </div>
        
        <button type="submit" className="btn-primary-accent" style={{ width: '100%' }}>
          Registrarse
        </button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </div>
    </div>
  );
};

export default Register;