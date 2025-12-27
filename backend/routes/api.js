// backend/routes/api.js
const express = require('express');
const router = express.Router();

// --- IMPORTAR TODOS LOS MODELOS ---
const Cita = require('../models/Cita');
const Servicio = require('../models/Servicio');
const User = require('../models/User');
const Bloqueo = require('../models/Bloqueo'); // <--- Asegúrate de que esto esté aquí

// ==========================================
// 1. RUTAS DE CITAS
// ==========================================
router.get('/citas', async (req, res) => {
  try {
    const citas = await Cita.find();
    res.json(citas);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/citas', async (req, res) => {
  try {
    const nuevaCita = new Cita(req.body);
    await nuevaCita.save();
    res.json(nuevaCita);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/citas/:id', async (req, res) => {
  try {
    const actualizada = await Cita.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizada);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ==========================================
// 2. RUTAS DE SERVICIOS
// ==========================================
router.get('/servicios', async (req, res) => {
  const servicios = await Servicio.find();
  res.json(servicios);
});

router.post('/servicios', async (req, res) => {
  const nuevo = new Servicio(req.body);
  await nuevo.save();
  res.json(nuevo);
});

router.put('/servicios/:id', async (req, res) => {
  const actualizado = await Servicio.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizado);
});

router.delete('/servicios/:id', async (req, res) => {
  await Servicio.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ==========================================
// 3. RUTAS DE BLOQUEOS (¡Lo que te faltaba!)
// ==========================================
router.get('/bloqueos', async (req, res) => {
  try {
    const bloqueos = await Bloqueo.find();
    res.json(bloqueos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/bloqueos', async (req, res) => {
  try {
    const nuevo = new Bloqueo(req.body);
    await nuevo.save();
    res.json(nuevo);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/bloqueos/:id', async (req, res) => {
  try {
    await Bloqueo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ==========================================
// 4. RUTAS DE USUARIOS (AUTH)
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;
    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ success: false, message: 'El correo ya existe' });

    const nuevoUsuario = new User(req.body);
    await nuevoUsuario.save();
    res.json({ success: true, user: nuevoUsuario });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/users/:email', async (req, res) => {
  try {
    const actualizado = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
    res.json(actualizado);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;