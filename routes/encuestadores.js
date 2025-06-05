const express = require('express');
const router = express.Router();
const Encuestador = require('../models/Encuestador');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// 🔓 GET /api/encuestadores/:carnet
// Consulta pública por carnet asignado (sin autenticación)
router.get('/:carnet', async (req, res) => {
  try {
    const encuestador = await Encuestador.findOne({ carnet_asignado: req.params.carnet });
    if (!encuestador) {
      return res.status(404).json({ message: 'Encuestador no encontrado' });
    }
    res.json(encuestador);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// 🔐 GET /api/encuestadores/all
// Solo administradores pueden ver el listado completo
router.get('/all', verifyToken, verifyAdmin, async (req, res) => {
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

// 🔐 POST /api/encuestadores
// Crear encuestador – cualquier usuario autenticado
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      nombre_completo,
      cedula,
      carnet_asignado,
      funcion,
      id_proyecto,
      es_confidencial,
      entidad_responsable,
      zona_designada,
      foto_url,
      estado
    } = req.body;

    if (!nombre_completo || !cedula || !carnet_asignado || !id_proyecto || !zona_designada || !foto_url) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const cedulaExistente = await Encuestador.findOne({ cedula });
    if (cedulaExistente) {
      return res.status(400).json({ message: 'Ya existe un encuestador con esta cédula' });
    }

    const carnetExistente = await Encuestador.findOne({ carnet_asignado });
    if (carnetExistente) {
      return res.status(400).json({ message: 'Ya existe un encuestador con este carnet' });
    }

    const nuevo = new Encuestador({
      nombre_completo,
      cedula,
      carnet_asignado,
      funcion,
      id_proyecto,
      es_confidencial: Boolean(es_confidencial),
      entidad_responsable,
      zona_designada,
      foto_url,
      estado
    });

    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el encuestador' });
  }
});

// 🔐 PUT /api/encuestadores/:id
// Editar encuestador – cualquier usuario autenticado
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_completo,
      cedula,
      carnet_asignado,
      funcion,
      id_proyecto,
      es_confidencial,
      entidad_responsable,
      zona_designada,
      foto_url,
      estado
    } = req.body;

    if (!nombre_completo || !cedula || !carnet_asignado || !id_proyecto || !zona_designada || !foto_url) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const cedulaExistente = await Encuestador.findOne({ cedula, _id: { $ne: id } });
    if (cedulaExistente) {
      return res.status(400).json({ message: 'Ya existe un encuestador con esta cédula' });
    }

    const carnetExistente = await Encuestador.findOne({ carnet_asignado, _id: { $ne: id } });
    if (carnetExistente) {
      return res.status(400).json({ message: 'Ya existe un encuestador con este carnet' });
    }

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
        foto_url,
        estado,
        actualizado_en: new Date()
      },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ message: 'Encuestador no encontrado' });
    }

    res.json(actualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el encuestador' });
  }
});

// 🔐 DELETE /api/encuestadores/:id
// Solo administradores pueden eliminar
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Encuestador.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ message: 'Encuestador no encontrado' });
    }
    res.json({ message: 'Encuestador eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el encuestador' });
  }
});

module.exports = router;