const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  cliente: {
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true }
  },
  barberoId: { type: String, required: true },
  servicio: { type: String, required: true },
  estado: { 
    type: String, 
    enum: ['pendiente', 'completada', 'cancelada'], 
    default: 'pendiente' 
  }
});

module.exports = mongoose.model('Cita', CitaSchema);