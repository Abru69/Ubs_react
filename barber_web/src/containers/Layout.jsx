// src/containers/Layout.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => (
  // ... contenido del componente Layout (header, nav, main, etc.)
  <>
    <header style={{ 
        padding: '15px 20px', 
        borderBottom: '3px solid #0056b3', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        color: 'white'
    }}>
      <h2 style={{ margin: 0 }}>💈 Unidos Barber Shop</h2>
      <nav>
        <Link 
          to="/" 
          style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
        >
          Cliente
        </Link>
        <Link 
          to="/admin" 
          style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
        >
          Administrador
        </Link>
      </nav>
    </header>
    <main style={{ padding: '20px' }}>
      {children}
    </main>
  </>
);

export default Layout; // <-- ¡Exportación obligatoria!