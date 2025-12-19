import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // 1. Si no hay usuario logueado, mandar al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si hay usuario, pero su rol no está autorizado (ej: cliente intentando entrar a admin)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Mandar al inicio o a una página de "Acceso Denegado"
  }

  // 3. Si pasa las validaciones, mostrar el contenido
  return children;
};

export default ProtectedRoute;