import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(formData.email, formData.password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="booking-form-container card">
      <h2 style={{ textAlign: 'center' }}>Bienvenido de nuevo</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>Ingresa a tu cuenta para gestionar tus citas.</p>

      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Correo Electrónico</label>
          <input 
            type="email" 
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Contraseña</label>
          <input 
            type="password" 
            placeholder="********"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required 
          />
        </div>
        
        <button type="submit" className="btn-primary-accent" style={{ width: '100%' }}>
          Ingresar
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9em' }}>
        ¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>Regístrate aquí</Link>
      </div>
      
      {/* Nota para pruebas */}
      <div style={{ marginTop: '30px', padding: '10px', background: '#f9f9f9', fontSize: '0.8em', border: '1px dashed #ccc' }}>
        <strong>Para probar:</strong><br/>
        Admin: admin@barber.com / 123456<br/>
        Cliente: (Cualquier otro)
      </div>
    </div>
  );
};

export default Login;