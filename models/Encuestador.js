const mongoose = require('mongoose');

const EncuestadorSchema = new mongoose.Schema({
  nombre_completo: { type: String, required: true },
  cedula: { type: String, unique: true, required: true },
  carnet_asignado: { type: String, unique: true, required: true },
  funcion: String,
  id_proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', required: true },
  es_confidencial: Boolean,
  entidad_responsable: String,
  zona_designada: String,
  foto_url: String,
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'inactivo' },
  creado_en: { type: Date, default: Date.now },
  actualizado_en: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Encuestador', EncuestadorSchema);