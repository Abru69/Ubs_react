// backend/models/Bloqueo.js
const mongoose = require('mongoose');

const BloqueoSchema = new mongoose.Schema({
  barberoId: { type: String, required: true },
  fecha: { type: String, required: true },
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },
  motivo: { type: String }
});

module.exports = mongoose.model('Bloqueo', BloqueoSchema);