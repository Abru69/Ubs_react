// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // unique evita correos repetidos
  password: { type: String, required: true },
  telefono: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['client', 'admin'], 
    default: 'client' // Por defecto, todos son clientes
  }
});

module.exports = mongoose.model('User', UserSchema);