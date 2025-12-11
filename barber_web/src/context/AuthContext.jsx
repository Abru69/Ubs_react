// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = no logueado
  const navigate = useNavigate();

  // Función simulada de Login (CONTROLADOR)
  const login = (email, password) => {
    // Simulación: Si el email es admin, es administrador
    if (email === 'admin@barber.com' && password === '123456') {
      const adminUser = { email, nombre: 'Miguel Admin', role: 'admin' };
      setUser(adminUser);
      navigate('/admin'); // Redirigir al dashboard
      return { success: true };
    } 
    
    // Simulación: Cualquier otro usuario es cliente
    if (email && password) {
      const clientUser = { email, nombre: 'Cliente Nuevo', role: 'client' };
      setUser(clientUser);
      navigate('/reservar'); // Redirigir a la reserva
      return { success: true };
    }

    return { success: false, message: 'Credenciales incorrectas' };
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  const register = (datosUsuario) => {
    // Aquí conectaríamos con una API real
    console.log('Registrando usuario:', datosUsuario);
    // Auto-login después del registro
    const newUser = { ...datosUsuario, role: 'client' };
    setUser(newUser);
    navigate('/reservar');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);