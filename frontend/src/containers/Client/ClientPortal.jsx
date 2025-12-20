import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCitas } from '../../hooks/useCitas';
import MyAppointments from '../../components/Client/MyAppointments';
import ClientProfile from '../../components/Client/ClientProfile';

const ClientPortal = () => {
  const { user, updateProfile } = useAuth();
  const { getCitasCliente, actualizarEstadoCita, barberos } = useCitas();
  const [activeTab, setActiveTab] = useState('citas');

  // Si no hay usuario cargado aún
  if (!user) return <div style={{padding: '50px', textAlign: 'center'}}>Cargando perfil...</div>;

  // Obtenemos citas del cliente actual
  const citasUsuario = getCitasCliente(user.email);

  const getBarberoNombre = (id) => {
    if (id === 'any') return 'Cualquiera';
    const b = barberos.find(barb => barb.id === id);
    return b ? b.nombre : 'Desconocido';
  };

  const handleCancel = (idCita) => {
    actualizarEstadoCita(idCita, 'cancelada');
  };

  return (
    <div className="client-portal-container" style={{ maxWidth: '900px', margin: '30px auto', padding: '0 15px' }}>
      
      {/* Encabezado */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <h2 style={{ color: 'var(--color-primary)' }}>Hola, {user.nombre} 👋</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Bienvenido a tu espacio personal.</p>
      </div>

      {/* Navegación por Pestañas */}
      <div className="tabs" style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <button 
          onClick={() => setActiveTab('citas')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'citas' ? '3px solid var(--color-accent)' : '3px solid transparent',
            background: 'transparent',
            fontWeight: 'bold',
            color: activeTab === 'citas' ? 'var(--color-primary)' : '#aaa',
            cursor: 'pointer',
            fontSize: '1.1em'
          }}
        >
          Mis Reservas
        </button>
        <button 
          onClick={() => setActiveTab('perfil')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'perfil' ? '3px solid var(--color-accent)' : '3px solid transparent',
            background: 'transparent',
            fontWeight: 'bold',
            color: activeTab === 'perfil' ? 'var(--color-primary)' : '#aaa',
            cursor: 'pointer',
            fontSize: '1.1em'
          }}
        >
          Mi Perfil
        </button>
      </div>

      {/* Contenido Dinámico */}
      <div className="tab-content">
        {activeTab === 'citas' ? (
          <MyAppointments 
            citas={citasUsuario} 
            onCancel={handleCancel} 
            getBarberoNombre={getBarberoNombre} 
          />
        ) : (
          <ClientProfile 
            user={user} 
            onUpdate={updateProfile} 
          />
        )}
      </div>
    </div>
  );
};

export default ClientPortal;