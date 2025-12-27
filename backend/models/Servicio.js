const mongoose = require('mongoose');

const ServicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  duracion: { type: Number, required: true },
  precio: { type: Number, required: true }
});

module.exports = mongoose.model('Servicio', ServicioSchema);