import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import Layout from './containers/Layout';
import './styles.css';

// Componentes
import LandingPage from './containers/Auth/LandingPage';
import Login from './containers/Auth/Login';
import Register from './containers/Auth/Register';
import ClientBooking from './containers/Client/ClientBooking';
import AdminDashboard from './containers/Admin/AdminDashboard';
import ClientPortal from './containers/Client/ClientPortal';

// Importamos el Guardia de Seguridad
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* --- RUTAS PÚBLICAS (Cualquiera puede entrar) --- */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* --- RUTAS DE CLIENTE (Solo usuarios registrados) --- */}
              <Route 
                path="/reservar" 
                element={
                  <ProtectedRoute allowedRoles={['client', 'admin']}>
                    <ClientBooking />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mi-cuenta" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientPortal />
                  </ProtectedRoute>
                } 
              />

              {/* --- RUTAS DE ADMINISTRADOR (Solo Rol 'admin') --- */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/:view" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* --- Fallback --- */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;