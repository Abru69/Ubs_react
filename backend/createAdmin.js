// backend/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Asegúrate de que la ruta al modelo sea correcta

// Conexión a la Base de Datos (Igual que en tu server.js)
const MONGO_URI = 'mongodb://localhost:27017/barberia_db';

const crearAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔌 Conectado a MongoDB...');

    // 1. Datos del Admin
    const email = 'barbero@barberia.com';
    const passwordPlana = 'admin123'; // <--- ESTA SERÁ TU CONTRASEÑA
    const nombre = 'Roberto Admin';

    // 2. Verificar si ya existe para no duplicarlo
    const existe = await User.findOne({ email });
    if (existe) {
      console.log('⚠️ El usuario admin ya existe.');
      
      // Opcional: Si quieres resetearlo, descomenta la siguiente línea:
      // await User.deleteOne({ email }); 
    } else {
      
      // 3. Encriptar la contraseña (¡CRUCIAL!)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(passwordPlana, salt);

      // 4. Crear el usuario con rol 'admin'
      const nuevoAdmin = new User({
        nombre,
        email,
        password: hashedPassword,
        telefono: '0000000000',
        role: 'admin' // <--- AQUÍ ESTÁ LA MAGIA
      });

      await nuevoAdmin.save();
      console.log('✅ ¡Usuario Administrador Creado con Éxito!');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Pass: ${passwordPlana}`);
    }

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

crearAdmin();