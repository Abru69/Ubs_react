// backend/seed.js
const mongoose = require('mongoose');
const Servicio = require('./models/Servicio');

// 1. Conexión a la Base de Datos
const MONGO_URI = 'mongodb://localhost:27017/barberia_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🌱 Conectado a Mongo para sembrar datos...'))
  .catch(err => console.error(err));

// 2. Datos de Prueba
const serviciosIniciales = [
  { nombre: 'Corte Clásico', duracion: 30, precio: 200 },
  { nombre: 'Corte Moderno (Fade)', duracion: 45, precio: 250 },
  { nombre: 'Afeitado de Barba', duracion: 30, precio: 150 },
  { nombre: 'Corte + Barba', duracion: 60, precio: 350 },
  { nombre: 'Perfilado de Cejas', duracion: 15, precio: 50 }
];

// 3. Función para borrar lo viejo e insertar lo nuevo
const importarDatos = async () => {
  try {
    // Borramos servicios antiguos para no duplicar
    await Servicio.deleteMany();
    console.log('🧹 Servicios antiguos eliminados.');

    // Insertamos los nuevos
    await Servicio.insertMany(serviciosIniciales);
    console.log('✅ Servicios de prueba insertados correctamente.');

    // Cerramos la conexión
    process.exit();
  } catch (error) {
    console.error('❌ Error importando datos:', error);
    process.exit(1);
  }
};

// Ejecutamos
importarDatos();