const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a Base de Datos
const MONGO_URI = 'mongodb://localhost:27017/barberia_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Base de Datos Conectada'))
  .catch(err => console.error('❌ Error Mongo:', err));

// Rutas
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});