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
  const { barberos, crearCita, citas, isTimeBlocked, servicios } = useCitas(); 
  
  const getDisponibilidad = (barberoId, fecha) => {
      const horasBase = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
      
      return horasBase.filter(hora => {
          if (barberoId === 'any') {
              // Disponible si AL MENOS UN barbero está libre en esa hora
              return barberos.some(b => {
                  const ocupado = citas.some(c => c.barberoId === b.id && c.fecha === fecha && c.hora === hora);
                  const bloqueado = isTimeBlocked(b.id, fecha, hora);
                  return !ocupado && !bloqueado;
              });
          }
          const ocupado = citas.some(c => c.barberoId === barberoId && c.fecha === fecha && c.hora === hora);
          const bloqueado = isTimeBlocked(barberoId, fecha, hora);
          return !ocupado && !bloqueado;
      });
  };
  
  const handleNextStep = (datos) => {
    setDatosReserva(prev => ({ ...prev, ...datos }));
    setPaso(prev => prev + 1);
  };

  // Agregamos 'async' aquí para poder esperar la respuesta del servidor
  const handleConfirmBooking = async (datosCliente) => {
    
    // Lógica para asignar barbero si eligió 'any'
    let barberoAsignado = datosReserva.barberoId;
    if (barberoAsignado === 'any') {
        const disponible = barberos.find(b => {
            const ocupado = citas.some(c => c.barberoId === b.id && c.fecha === datosReserva.fecha && c.hora === datosReserva.hora);
            const bloqueado = isTimeBlocked(b.id, datosReserva.fecha, datosReserva.hora);
            return !ocupado && !bloqueado;
        });
        barberoAsignado = disponible ? disponible.id : barberos[0].id; // Fallback al primero si no hay
    }

    // --- CORRECCIÓN AQUÍ ---
    // Creamos el objeto exacto que pide el Backend (Cita.js)
    const citaFinal = { 
      fecha: datosReserva.fecha,
      hora: datosReserva.hora,
      barberoId: barberoAsignado,
      cliente: datosCliente,
      servicio: datosReserva.servicioNombre // <--- ¡AQUÍ ESTABA EL ERROR! Mapeamos el nombre al campo 'servicio'
    };

    try {
      // Usamos await para esperar a que se guarde en la BD antes de confirmar
      const creada = await crearCita(citaFinal); 
      
      setDatosReserva(citaFinal);
      setMensajeConfirmacion(`¡Cita confirmada! Código: ${creada.id}`);
      setPaso(4); 
    } catch (error) {
      console.error("Error reservando:", error);
      alert("Hubo un error al crear la reserva. Intenta nuevamente.");
    }
  };

  return (
    <div className="client-booking card" style={{ maxWidth: '800px', margin: '20px auto' }}>
      <h2 style={{ textAlign: 'center' }}>Reserva tu Cita</h2>
      <div className="steps-indicator" style={{ marginBottom: '30px', textAlign: 'center', color: '#666' }}>
        Paso {paso} de 4
      </div>

      {paso === 1 && <ServiceBarberSelector servicios={servicios} barberos={barberos} onNext={handleNextStep} />}
      {paso === 2 && <TimeSelector datosReserva={datosReserva} getDisponibilidad={getDisponibilidad} onNext={handleNextStep} onBack={() => setPaso(1)} />}
      {paso === 3 && <ClientForm datosReserva={datosReserva} onConfirm={handleConfirmBooking} onBack={() => setPaso(2)} />}
      {paso === 4 && <BookingConfirmation mensaje={mensajeConfirmacion} datosReserva={datosReserva} />}
    </div>
  );
}

export default ClientBooking;