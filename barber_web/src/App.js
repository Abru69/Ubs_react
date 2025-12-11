import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Importar el contexto
import Layout from './containers/Layout';
import './styles.css';

// Contenedores
import LandingPage from './containers/Auth/LandingPage';
import Login from './containers/Auth/Login';
import Register from './containers/Auth/Register';
import ClientBooking from './containers/Client/ClientBooking';
import AdminDashboard from './containers/Admin/AdminDashboard';

function App() {
  return (
    <Router>
      {/* Todo dentro del AuthProvider para que login/logout funcione globalmente */}
      <ThemeProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* Ruta Pública: Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Rutas de Autenticación */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Ruta del Cliente (Ahora en /reservar) */}
              <Route path="/reservar" element={<ClientBooking />} />

              {/* Rutas del Administrador */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Opcional: Ruta por defecto si no encuentra nada */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;