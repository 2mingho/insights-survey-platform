const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');
const Encuestador = require('../models/Encuestador');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// 🔓 GET /api/proyectos
// Ruta pública para cargar opciones en formularios
router.get('/', async (req, res) => {
  try {
    const proyectos = await Proyecto.find().sort({ creado_en: -1 });
    res.json(proyectos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener proyectos' });
  }
});

// 🔐 POST /api/proyectos
// Crear proyecto – solo administradores
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, foto_url } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del proyecto es obligatorio' });
    }

    const existe = await Proyecto.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ message: 'Ya existe un proyecto con ese nombre' });
    }

    const nuevo = new Proyecto({ nombre, descripcion, foto_url });

    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el proyecto' });
  }
});

// 🔐 DELETE /api/proyectos/:id
// Eliminar proyecto – solo administradores
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const asociados = await Encuestador.findOne({ id_proyecto: id });
    if (asociados) {
      return res.status(400).json({
        message: 'No se puede eliminar un proyecto con encuestadores asignados.'
      });
    }

    const eliminado = await Proyecto.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el proyecto' });
  }
});

// 🔐 PUT /api/proyectos/:id
// Actualizar proyecto – solo administradores
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, foto_url } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del proyecto es obligatorio' });
    }

    const duplicado = await Proyecto.findOne({ nombre, _id: { $ne: id } });
    if (duplicado) {
      return res.status(400).json({ message: 'Ya existe otro proyecto con ese nombre' });
    }

    const actualizado = await Proyecto.findByIdAndUpdate(
      id,
      {
        nombre,
        descripcion,
        foto_url,
        actualizado_en: new Date()
      },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json(actualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el proyecto' });
  }
});

module.exports = router;