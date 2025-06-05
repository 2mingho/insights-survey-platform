const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config();

const Admin = require('../models/Admin');

// Ruta para login
router.post('/login', async (req, res) => {
  const { mail, contraseña } = req.body;

  try {
    const admin = await Admin.findOne({ mail });
    if (!admin) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const esValida = await bcrypt.compare(contraseña, admin.contraseña_hash);
    if (!esValida) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: admin._id, mail: admin.mail },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, nombre: admin.nombre });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;