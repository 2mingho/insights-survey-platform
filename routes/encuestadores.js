const express = require('express');
const router = express.Router();
const Encuestador = require('../models/Encuestador');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Función para borrar archivo del servidor
function eliminarImagen(rutaRelativa) {
  const rutaAbsoluta = path.join(__dirname, '..', 'public', rutaRelativa);
  fs.unlink(rutaAbsoluta, err => {
    if (err) console.warn('⚠️ No se pudo eliminar la imagen:', rutaRelativa);
  });
}

// 🔐 GET /api/encuestadores/all
router.get('/all', verifyToken, async (req, res) => {
  try {
    const encuestadores = await Encuestador.find()
      .populate('id_proyecto', 'nombre')
      .sort({ creado_en: -1 });
    res.json(encuestadores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener encuestadores' });
  }
});

// 🔐 GET /api/encuestadores/id/:id
router.get('/id/:id', verifyToken, async (req, res) => {
  try {
    const encuestador = await Encuestador.findById(req.params.id)
      .populate('id_proyecto', 'nombre');
    if (!encuestador) {
      return res.status(404).json({ message: 'Encuestador no encontrado' });
    }
    res.json(encuestador);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el encuestador' });
  }
});

// 🔐 POST /api/encuestadores
router.post('/', verifyToken, upload.single('foto'), async (req, res) => {
  try {
    const {
      nombre_completo, cedula, carnet_asignado, funcion,
      id_proyecto, es_confidencial, entidad_responsable,
      zona_designada, estado
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Debe adjuntar una imagen' });
    }

    const foto_url = `/imagenes/${req.file.filename}`;

    const cedulaExistente = await Encuestador.findOne({ cedula });
    if (cedulaExistente) return res.status(400).json({ message: 'Ya existe un encuestador con esta cédula' });

    const carnetExistente = await Encuestador.findOne({ carnet_asignado });
    if (carnetExistente) return res.status(400).json({ message: 'Ya existe un encuestador con este carnet' });

    const nuevo = new Encuestador({
      nombre_completo,
      cedula,
      carnet_asignado,
      funcion,
      id_proyecto,
      es_confidencial: Boolean(es_confidencial),
      entidad_responsable,
      zona_designada,
      estado,
      foto_url
    });

    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el encuestador' });
  }
});

// 🔐 PUT /api/encuestadores/id/:id
router.put('/id/:id', verifyToken, upload.single('foto'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_completo, cedula, carnet_asignado, funcion,
      id_proyecto, es_confidencial, entidad_responsable,
      zona_designada, estado, foto_actual
    } = req.body;

    let foto_url = foto_actual;
    if (req.file) {
      foto_url = `/imagenes/${req.file.filename}`;
      if (foto_actual && foto_actual !== foto_url) {
        eliminarImagen(foto_actual);
      }
    }

    const cedulaExistente = await Encuestador.findOne({ cedula, _id: { $ne: id } });
    if (cedulaExistente) return res.status(400).json({ message: 'Ya existe un encuestador con esta cédula' });

    const carnetExistente = await Encuestador.findOne({ carnet_asignado, _id: { $ne: id } });
    if (carnetExistente) return res.status(400).json({ message: 'Ya existe un encuestador con este carnet' });

    const actualizado = await Encuestador.findByIdAndUpdate(
      id,
      {
        nombre_completo,
        cedula,
        carnet_asignado,
        funcion,
        id_proyecto,
        es_confidencial: Boolean(es_confidencial),
        entidad_responsable,
        zona_designada,
        estado,
        foto_url,
        actualizado_en: new Date()
      },
      { new: true }
    );

    if (!actualizado) return res.status(404).json({ message: 'Encuestador no encontrado' });

    res.json(actualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el encuestador' });
  }
});

// 🔐 DELETE /api/encuestadores/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Encuestador.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ message: 'Encuestador no encontrado' });
    }

    if (eliminado.foto_url) {
      eliminarImagen(eliminado.foto_url);
    }

    res.json({ message: 'Encuestador eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el encuestador' });
  }
});

// 🔓 GET /api/encuestadores/carnet/:carnet
router.get('/carnet/:carnet', async (req, res) => {
  try {
    const encuestador = await Encuestador.findOne({ carnet_asignado: req.params.carnet })
      .populate('id_proyecto', 'nombre');
    if (!encuestador) {
      return res.status(404).json({ message: 'Encuestador no encontrado' });
    }
    res.json(encuestador);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;