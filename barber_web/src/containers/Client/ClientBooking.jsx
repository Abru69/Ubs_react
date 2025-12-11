// src/containers/Client/ClientBooking.jsx

import React, { useState, useMemo } from 'react';
import { useCitas } from '../../hooks/useCitas'; 
import ServiceBarberSelector from '../../components/Client/ServiceBarberSelector';
import TimeSelector from '../../components/Client/TimeSelector';
import BookingConfirmation from '../../components/Client/BookingConfirmation';
import ClientForm from '../../components/Client/ClientForm';

function ClientBooking() {
  const [paso, setPaso] = useState(1);
  const [datosReserva, setDatosReserva] = useState({});
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');

  // Importamos todos los datos y lógicas necesarios del Modelo/Controlador
  const { barberos, crearCita, citas, isTimeBlocked, servicios } = useCitas(); 
  
  // CONTROLADOR: Lógica para determinar disponibilidad
  const getDisponibilidad = (barberoId, fecha) => {
      // 1. Horarios base (en un proyecto real, esto sería dinámico)
      const horasBase = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
      
      // 2. Citas existentes
      const citasDelDia = citas.filter(c => c.barberoId === barberoId && c.fecha === fecha);
      
      return horasBase.filter(hora => {
        // a) Si ya está ocupada por una cita
        const isBooked = citasDelDia.some(cita => cita.hora === hora);
        
        // b) Si el barbero la bloqueó manualmente
        const isBlocked = isTimeBlocked(barberoId, fecha, hora); 
        
        // La hora está disponible si NO está reservada Y NO está bloqueada
        return !isBooked && !isBlocked;
      });
  };
  
  // Función para avanzar y guardar datos (Paso 1 -> 2, Paso 2 -> 3)
  const handleNextStep = (nuevosDatos) => {
    setDatosReserva(prev => ({ ...prev, ...nuevosDatos }));
    setPaso(prev => prev + 1);
  };

  // Función CORREGIDA para completar la reserva (Paso 3 -> 4)
  const handleConfirmBooking = (datosCliente) => {
    
    // 1. CREAR la estructura final de la cita (juntando datos previos + datos del cliente)
    const citaFinal = {
        ...datosReserva,
        cliente: datosCliente, 
        estado: 'confirmada' 
    };

    // 2. IMPORTANTE: Actualizar el estado local antes de cambiar de paso (Corrige el error de 'email')
    setDatosReserva(citaFinal); 
    
    // 3. LLAMADA AL MODELO para persistir la cita
    const citaCreada = crearCita(citaFinal); 

    // 4. CAMBIAMOS DE PASO
    setMensajeConfirmacion(`¡Cita con ID: ${citaCreada.id} confirmada con éxito!`);
    setPaso(4); 
  };

  // -------------------------------------------------------------------
  
  return (
    <div className="client-booking">
      <h3>Paso {paso} de 4: {
        paso === 1 ? 'Seleccionar Servicio y Barbero' : 
        paso === 2 ? 'Seleccionar Fecha y Hora' : 
        paso === 3 ? 'Ingresar Datos Personales' : 'Confirmación'
      }</h3>

      {/* RENDERIZADO CONDICIONAL DE LOS PASOS */}

      {paso === 1 && (
        <ServiceBarberSelector
          servicios={servicios} // Usamos los servicios del hook (MODELO)
          barberos={barberos}
          onNext={handleNextStep}
        />
      )}

      {paso === 2 && (
        <TimeSelector
          datosReserva={datosReserva}
          getDisponibilidad={getDisponibilidad} // Lógica de disponibilidad
          onNext={handleNextStep}
          onBack={() => setPaso(1)}
        />
      )}

      {paso === 3 && (
        <ClientForm
          datosReserva={datosReserva}
          onConfirm={handleConfirmBooking}
          onBack={() => setPaso(2)}
        />
      )}
      
      {paso === 4 && (
        <BookingConfirmation
          mensaje={mensajeConfirmacion}
          datosReserva={datosReserva} 
        />
      )}
      
      {/* Muestra los datos que se están recolectando */}
      <pre style={{ marginTop: '20px', border: '1px solid #eee', padding: '10px' }}>
        Datos de la Reserva (Controlador): {JSON.stringify(datosReserva, null, 2)}
      </pre>
    </div>
  );
}

export default ClientBooking;