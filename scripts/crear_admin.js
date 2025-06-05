const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const Admin = require('../models/Admin');

async function crearAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const contraseña_hash = await bcrypt.hash('admin123', 10);

  const nuevo = new Admin({
    nombre: 'Admin Principal',
    mail: 'admin@demo.com',
    contraseña_hash
  });

  await nuevo.save();
  console.log('Administrador creado');
  mongoose.disconnect();
}

crearAdmin();