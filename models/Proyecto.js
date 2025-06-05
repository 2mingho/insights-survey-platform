const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: String,
  foto_url: String,
  creado_en: { type: Date, default: Date.now },
  actualizado_en: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);