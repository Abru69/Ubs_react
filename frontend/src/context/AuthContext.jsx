import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ubs_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('ubs_user', JSON.stringify(data.user));
        navigate(data.user.role === 'admin' ? '/admin' : '/mi-cuenta');
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  };

  const register = async (datos) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const data = await res.json();

      if (data.success) {
        // Auto-login al registrar
        setUser(data.user);
        localStorage.setItem('ubs_user', JSON.stringify(data.user));
        navigate('/mi-cuenta');
        return { success: true };
      } else {
        return { success: false, message: 'No se pudo registrar' };
      }
    } catch (error) {
      return { success: false, message: 'Error al registrar' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ubs_user');
    navigate('/');
  };

  const updateProfile = async (datos) => {
    // Actualizamos en BD
    if (user && user.email) {
      try {
        const res = await fetch(`${API_URL}/users/${user.email}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });
        const updatedUser = await res.json();
        
        // Actualizamos estado local
        setUser(updatedUser);
        localStorage.setItem('ubs_user', JSON.stringify(updatedUser));
      } catch (err) {
        console.error("Error actualizando perfil", err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);