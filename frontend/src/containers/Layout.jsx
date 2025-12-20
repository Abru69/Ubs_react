import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth(); 
  const { theme, toggleTheme } = useTheme(); 
  const location = useLocation();

  const showAdminSidebar = user?.role === 'admin';

  return (
    <div className="app-layout">
      
      {/* Header Fijo */}
      <header className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h2 className="logo-title">💈 Unidos Barber Shop</h2>
            </Link>
        </div>

        <nav className="nav-top" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
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
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <>
              <span className="user-greeting" style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>
                Hola, <strong>{user.nombre}</strong>
              </span>
              
              {/* MENÚ CLIENTE */}
              {user.role === 'client' && (
                 <>
                    <Link to="/mi-cuenta" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>
                        Mi Cuenta
                    </Link>
                    <Link to="/reservar" className="btn-primary-accent" style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '0.9em', borderRadius: '4px' }}>
                        + Reservar
                    </Link>
                 </>
              )}
              
              {/* MENÚ ADMIN */}
              {user.role === 'admin' && (
                 <Link to="/admin" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>
                    Panel Admin
                 </Link>
              )}

              <button 
                onClick={logout} 
                style={{ 
                    padding: '6px 12px', 
                    fontSize: '0.8em', 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginLeft: '10px'
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Inicio</Link>
              <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Ingresar</Link>
              <Link to="/register" className="btn-primary-accent" style={{ textDecoration: 'none', padding: '8px 15px', borderRadius: '4px' }}>
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </header>
      
      {/* Contenedor Principal */}
      <div className="content-wrapper">
        
        {/* Sidebar Admin */}
        {showAdminSidebar && (
            <aside className="sidebar">
                <div style={{ padding: '0 20px 20px 20px', fontSize: '0.85em', color: '#a3aed0', fontWeight: 600, letterSpacing: '1px' }}>
                    ADMINISTRACIÓN
                </div>
                <nav className="nav-sidebar">
                    <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                        <span>🏠 Dashboard</span>
                    </Link>
                    <Link to="/admin/citas" className={location.pathname.includes('citas') ? 'active' : ''}>
                        <span>📅 Citas</span>
                    </Link>
                    <Link to="/admin/servicios" className={location.pathname.includes('servicios') ? 'active' : ''}>
                        <span>⚙️ Servicios</span>
                    </Link>
                    <Link to="/admin/clientes" className={location.pathname.includes('clientes') ? 'active' : ''}>
                        <span>👥 Clientes</span>
                    </Link>
                </nav>
            </aside>
        )}

        <main className="main-content-area" style={{ width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;