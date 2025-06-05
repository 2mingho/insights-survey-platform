const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  contraseña_hash: { type: String, required: true }
});

module.exports = mongoose.model('Admin', adminSchema);