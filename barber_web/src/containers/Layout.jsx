import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useTheme } from '../context/ThemeContext'; // <--- 1. Importamos el contexto del Tema

const Layout = ({ children }) => {
  const { user, logout } = useAuth(); 
  const { theme, toggleTheme } = useTheme(); // <--- 2. Obtenemos la función para cambiar el tema
  const location = useLocation();

  const showAdminSidebar = user?.role === 'admin';

  return (
    <div className="app-layout">
      
      {/* 1. Header Fijo */}
      <header className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 className="logo-title">💈 Unidos Barber Shop</h2>
        </div>

        <nav className="nav-top" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* --- 3. BOTÓN DE MODO OBSCURO --- */}
          <button 
            onClick={toggleTheme} 
            title="Cambiar Modo"
            style={{
                background: 'transparent',
                border: '1px solid var(--text-secondary)', 
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: 'var(--text-main)',
                transition: 'all 0.3s ease'
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {/* ----------------------------- */}

          {/* Navegación Condicional de Usuario */}
          {user ? (
            <>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>
                Hola, <strong style={{ color: 'var(--text-main)' }}>{user.nombre}</strong>
              </span>
              
              {user.role === 'client' && (
                 <Link to="/reservar" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Nueva Reserva</Link>
              )}
              
              {user.role === 'admin' && (
                 <Link to="/admin" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Panel</Link>
              )}

              <button 
                onClick={logout} 
                className="btn-primary-accent" 
                style={{ padding: '8px 15px', fontSize: '0.8em', backgroundColor: '#dc3545', boxShadow: 'none' }}
              >
                Salir
              </button>
            </>
          ) : (
            <>
               {/* Si no hay usuario */}
              <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Inicio</Link>
              <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Iniciar Sesión</Link>
              <Link to="/register" className="btn-primary-accent" style={{ textDecoration: 'none', padding: '8px 15px', borderRadius: '4px' }}>
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </header>
      
      {/* 2. Contenedor Principal */}
      <div className="content-wrapper">
        
        {/* Sidebar: Solo visible para el Administrador */}
        {showAdminSidebar && (
            <aside className="sidebar">
                <div style={{ padding: '0 20px 20px 20px', fontSize: '0.85em', color: '#a3aed0', fontWeight: 600, letterSpacing: '1px' }}>
                    PANEL ADMINISTRATIVO
                </div>
                <nav className="nav-sidebar">
                    <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                        <span>🏠 Panel de Control</span>
                    </Link>
                    <Link to="/admin" className={location.pathname.includes('citas') ? 'active' : ''}>
                        <span>📅 Todas las Citas</span>
                    </Link>
                    <Link to="/admin" className={location.pathname.includes('servicios') ? 'active' : ''}>
                        <span>⚙️ Servicios</span>
                    </Link>
                    <Link to="/admin" className={location.pathname.includes('clientes') ? 'active' : ''}>
                        <span>👥 Clientes</span>
                    </Link>
                </nav>
            </aside>
        )}

        {/* Área de Contenido Principal */}
        <main className="main-content-area" style={{ width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;