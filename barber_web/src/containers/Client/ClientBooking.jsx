// src/containers/Client/ClientBooking.jsx

import React, { useState, useMemo } from 'react';
import { useCitas } from '../../hooks/useCitas'; 
import ServiceBarberSelector from '../../components/Client/ServiceBarberSelector';
import TimeSelector from '../../components/Client/TimeSelector';
import BookingConfirmation from '../../components/Client/BookingConfirmation';
import ClientForm from '../../components/Client/ClientForm';

// --- MOCK DE SERVICIOS (Parte del MODELO) ---
const SERVICIOS = [
  { id: 's1', nombre: 'Corte Clásico', duracion: 45, precio: 15 },
  { id: 's2', nombre: 'Arreglo de Barba', duracion: 30, precio: 10 },
  { id: 's3', nombre: 'Corte + Barba', duracion: 75, precio: 25 },
];
// ---------------------------------------------


function ClientBooking() {
  const [paso, setPaso] = useState(1);
  const [datosReserva, setDatosReserva] = useState({});
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');

  const { barberos, crearCita, citas } = useCitas(); 
  
  // Lógica para determinar disponibilidad (CONTROLADOR)
  const getDisponibilidad = (barberoId, fecha) => {
      // Lógica de disponibilidad Simplificada (Horas en punto)
      const citasDelDia = citas.filter(c => c.barberoId === barberoId && c.fecha === fecha);
      
      const horasDisponibles = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

      return horasDisponibles.filter(hora => 
        !citasDelDia.some(cita => cita.hora === hora)
      );
  };
  // ---------------------------------------------

  // Función para avanzar y guardar datos (CORRECTO)
  const handleNextStep = (nuevosDatos) => {
    setDatosReserva(prev => ({ ...prev, ...nuevosDatos }));
    setPaso(prev => prev + 1);
  };

  // Función corregida para completar la reserva (Paso 3 -> 4)
  const handleConfirmBooking = (datosCliente) => {
    
    // 1. CREAR la estructura final de la cita
    const citaFinal = {
        ...datosReserva,
        cliente: datosCliente, 
        estado: 'confirmada' 
    };

    // 2. IMPORTANTE: Actualizar el estado del controlador antes de cambiar de paso
    setDatosReserva(citaFinal); 
    
    // 3. LLAMADA AL MODELO
    const citaCreada = crearCita(citaFinal); 

    // 4. CAMBIAMOS DE PASO
    setMensajeConfirmacion(`¡Cita con ID: ${citaCreada.id} confirmada con éxito!`);
    setPaso(4); 
  };

  // -------------------------------------------------------------------
  
  // ************ BLOQUE DE RETORNO (JSX) CORREGIDO ************
  return (
    <div className="client-booking">
      <h3>Paso {paso} de 4: {
        paso === 1 ? 'Seleccionar Servicio y Barbero' : 
        paso === 2 ? 'Seleccionar Fecha y Hora' : 
        paso === 3 ? 'Ingresar Datos Personales' : 'Confirmación'
      }</h3>

      {paso === 1 && (
        <ServiceBarberSelector
          servicios={SERVICIOS}
          barberos={barberos}
          onNext={handleNextStep}
        />
      )}

      {paso === 2 && (
        <TimeSelector
          datosReserva={datosReserva}
          getDisponibilidad={getDisponibilidad} 
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
          datosReserva={datosReserva} // Ahora 'datosReserva' tiene 'cliente' completo
        />
      )}
      
      {/* Muestra los datos que se están recolectando */}
      <pre style={{ marginTop: '20px', border: '1px solid #eee', padding: '10px' }}>
        Datos de la Reserva (Controlador): {JSON.stringify(datosReserva, null, 2)}
      </pre>
    </div>
  );
  // *************************************************************
}

export default ClientBooking;