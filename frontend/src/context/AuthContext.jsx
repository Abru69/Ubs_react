import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  // Estado para el Usuario
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ubs_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Estado para el Token (NUEVO)
  const [token, setToken] = useState(() => {
    return localStorage.getItem('ubs_token') || null;
  });
  
  const navigate = useNavigate();

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        // Guardar Usuario y TOKEN
        setUser(data.user);
        setToken(data.token);
        
        localStorage.setItem('ubs_user', JSON.stringify(data.user));
        localStorage.setItem('ubs_token', data.token); // Guardamos el token

        navigate(data.user.role === 'admin' ? '/admin' : '/mi-cuenta');
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  };

  // REGISTER
  const register = async (datos) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const data = await res.json();

      if (data.success) {
        // Auto-login al registrar (Guardar Token también)
        setUser(data.user);
        setToken(data.token);

        localStorage.setItem('ubs_user', JSON.stringify(data.user));
        localStorage.setItem('ubs_token', data.token);

        navigate('/mi-cuenta');
        return { success: true };
      } else {
        return { success: false, message: data.message || 'No se pudo registrar' };
      }
    } catch (error) {
      return { success: false, message: 'Error al registrar' };
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ubs_user');
    localStorage.removeItem('ubs_token'); // Limpiar token al salir
    navigate('/');
  };

  // ACTUALIZAR PERFIL
  const updateProfile = async (datos) => {
    if (user && user.email) {
      try {
        const res = await fetch(`${API_URL}/users/${user.email}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });
        const updatedUser = await res.json();
        
        setUser(updatedUser);
        localStorage.setItem('ubs_user', JSON.stringify(updatedUser));
      } catch (err) {
        console.error("Error actualizando perfil", err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);