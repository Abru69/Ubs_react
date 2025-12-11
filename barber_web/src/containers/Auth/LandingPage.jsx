// src/containers/Auth/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-container" style={{ textAlign: 'center', padding: '50px 20px' }}>
      
      {/* Hero Section */}
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
        <h1 style={{ fontSize: '3em', marginBottom: '10px', color: 'var(--color-primary)' }}>
          💈 Unidos Barber Shop
        </h1>
        <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '30px' }}>
          Estilo, tradición y la mejor atención en un solo lugar.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
          <Link to="/login">
            <button className="btn-primary-accent" style={{ padding: '15px 40px', fontSize: '1.1em' }}>
              Iniciar Sesión
            </button>
          </Link>
          
          <Link to="/register">
            <button className="btn-secondary-nav" style={{ padding: '15px 40px', fontSize: '1.1em' }}>
              Registrarse
            </button>
          </Link>
        </div>
      </div>

      {/* Features Section (Decorativo) */}
      <div className="data-widget-grid" style={{ marginTop: '50px', maxWidth: '1000px', margin: '50px auto' }}>
        <div className="data-widget" style={{ backgroundColor: '#fff', color: '#333', border: '1px solid #eee' }}>
          <span className="widget-value">📅</span>
          <span className="widget-title" style={{color: '#333'}}>Reservas Online</span>
        </div>
        <div className="data-widget" style={{ backgroundColor: '#fff', color: '#333', border: '1px solid #eee' }}>
          <span className="widget-value">✂️</span>
          <span className="widget-title" style={{color: '#333'}}>Mejores Estilos</span>
        </div>
        <div className="data-widget" style={{ backgroundColor: '#fff', color: '#333', border: '1px solid #eee' }}>
          <span className="widget-value">⭐</span>
          <span className="widget-title" style={{color: '#333'}}>Calidad Premium</span>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;