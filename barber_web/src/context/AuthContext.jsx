import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Cargar usuario de LocalStorage al iniciar
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ubs_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const navigate = useNavigate();

  const login = (email, password) => {
    // Simulación ADMIN
    if (email === 'admin@barber.com' && password === '123456') {
      const adminUser = { email, nombre: 'Miguel Admin', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('ubs_user', JSON.stringify(adminUser));
      navigate('/admin');
      return { success: true };
    } 
    
    // Simulación CLIENTE
    if (email && password) {
      // En una app real, aquí validaríamos contra una DB
      const clientUser = { 
          email, 
          nombre: 'Cliente Registrado', 
          telefono: '555-0000', 
          role: 'client' 
      };
      setUser(clientUser);
      localStorage.setItem('ubs_user', JSON.stringify(clientUser));
      navigate('/mi-cuenta'); // Redirigir al portal del cliente
      return { success: true };
    }

    return { success: false, message: 'Credenciales incorrectas' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ubs_user');
    navigate('/');
  };

  const register = (datosUsuario) => {
    const newUser = { ...datosUsuario, role: 'client' };
    setUser(newUser);
    localStorage.setItem('ubs_user', JSON.stringify(newUser));
    navigate('/mi-cuenta');
  };

  // NUEVO: Función para actualizar perfil
  const updateProfile = (updatedData) => {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('ubs_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);