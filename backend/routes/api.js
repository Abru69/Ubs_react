// backend/routes/api.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Configuración de clave secreta
require('dotenv').config(); 
const SECRET_KEY = process.env.JWT_SECRET || 'secreto_super_seguro_dev';

// --- IMPORTAR MODELOS ---
const Cita = require('../models/Cita');
const Servicio = require('../models/Servicio');
const User = require('../models/User');
const Bloqueo = require('../models/Bloqueo');

// ==========================================
// MIDDLEWARE DE SEGURIDAD
// ==========================================
const verificarToken = (req, res, next) => {
  const tokenHeader = req.headers['authorization']; 
  
  if (!tokenHeader) {
    return res.status(403).json({ message: 'Acceso denegado: Se requiere Token' });
  }

  try {
    const token = tokenHeader.split(" ")[1]; 
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// ==========================================
// 1. RUTAS DE CITAS
// ==========================================
router.get('/citas', verificarToken, async (req, res) => {
  try {
    const citas = await Cita.find();
    res.json(citas);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/citas', verificarToken, async (req, res) => {
  try {
    const nuevaCita = new Cita(req.body);
    await nuevaCita.save();
    res.json(nuevaCita);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/citas/:id', verificarToken, async (req, res) => {
  try {
    const actualizada = await Cita.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizada);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ==========================================
// 2. RUTAS DE SERVICIOS
// ==========================================
router.get('/servicios', verificarToken, async (req, res) => {
  try {
    const servicios = await Servicio.find();
    res.json(servicios);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/servicios', verificarToken, async (req, res) => {
  try {
    const nuevo = new Servicio(req.body);
    await nuevo.save();
    res.json(nuevo);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/servicios/:id', verificarToken, async (req, res) => {
  try {
    const actualizado = await Servicio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/servicios/:id', verificarToken, async (req, res) => {
  try {
    await Servicio.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ==========================================
// 3. RUTAS DE BLOQUEOS
// ==========================================
router.get('/bloqueos', verificarToken, async (req, res) => {
  try {
    const bloqueos = await Bloqueo.find();
    res.json(bloqueos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/bloqueos', verificarToken, async (req, res) => {
  try {
    const nuevo = new Bloqueo(req.body);
    await nuevo.save();
    res.json(nuevo);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/bloqueos/:id', verificarToken, async (req, res) => {
  try {
    await Bloqueo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ==========================================
// 4. RUTAS DE USUARIOS / AUTH
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { email, password, nombre, telefono } = req.body;
    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ success: false, message: 'El correo ya existe' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({ 
      email, 
      password: hashedPassword, 
      nombre, 
      telefono,
      role: 'client' 
    });
    await nuevoUsuario.save();

    const token = jwt.sign({ id: nuevoUsuario._id, role: nuevoUsuario.role }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ success: true, user: nuevoUsuario, token });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Usuario no encontrado' });

    const esCorrecta = await bcrypt.compare(password, user.password);
    if (!esCorrecta) return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ success: true, user, token });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/users/:email', verificarToken, async (req, res) => {
  try {
    const actualizado = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
    res.json(actualizado);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ==========================================
// 5. RUTAS ADMINISTRATIVAS (NUEVO)
// ==========================================
// Obtener lista completa de usuarios (Solo Admin)
router.get('/users', verificarToken, async (req, res) => {
  try {
    // Verificación extra de rol
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado: Solo administradores' });
    }
    // Buscamos solo clientes y excluimos la contraseña por seguridad
    const usuarios = await User.find({ role: 'client' }).select('-password');
    res.json(usuarios);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;