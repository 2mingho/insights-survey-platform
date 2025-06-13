const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');
const Encuestador = require('../models/Encuestador');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Utilidad para borrar imagen vieja
function eliminarImagen(rutaRelativa) {
  const rutaAbsoluta = path.join(__dirname, '..', 'public', rutaRelativa);
  fs.unlink(rutaAbsoluta, err => {
    if (err) console.warn('⚠️ No se pudo eliminar la imagen:', rutaRelativa);
  });
}

// 🔓 GET /api/proyectos
router.get('/', async (req, res) => {
  try {
    const proyectos = await Proyecto.find().sort({ creado_en: -1 });
    res.json(proyectos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener proyectos' });
  }
});

// 🔐 POST /api/proyectos
router.post('/', verifyToken, upload.single('foto'), async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) return res.status(400).json({ message: 'El nombre es obligatorio' });
    if (!req.file) return res.status(400).json({ message: 'Debe subir un logo' });

    const foto_url = `/imagenes/${req.file.filename}`;

    const existe = await Proyecto.findOne({ nombre });
    if (existe) return res.status(400).json({ message: 'Ya existe un proyecto con ese nombre' });

    const nuevo = new Proyecto({ nombre, descripcion, foto_url });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el proyecto' });
  }
});

// 🔐 DELETE /api/proyectos/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const asociados = await Encuestador.findOne({ id_proyecto: id });
    if (asociados) {
      return res.status(400).json({
        message: 'No se puede eliminar un proyecto con encuestadores asignados.'
      });
    }

    const eliminado = await Proyecto.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ message: 'Proyecto no encontrado' });

    if (eliminado.foto_url) {
      eliminarImagen(eliminado.foto_url);
    }

    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el proyecto' });
  }
});

// 🔐 GET /api/proyectos/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.json(proyecto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el proyecto' });
  }
});

// 🔐 PUT /api/proyectos/:id
router.put('/:id', verifyToken, upload.single('foto'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, foto_actual } = req.body;

    if (!nombre) return res.status(400).json({ message: 'El nombre es obligatorio' });

    const duplicado = await Proyecto.findOne({ nombre, _id: { $ne: id } });
    if (duplicado) return res.status(400).json({ message: 'Ya existe otro proyecto con ese nombre' });

    let foto_url = foto_actual;
    if (req.file) {
      foto_url = `/imagenes/${req.file.filename}`;
      if (foto_actual && foto_actual !== foto_url) {
        eliminarImagen(foto_actual);
      }
    }

    const actualizado = await Proyecto.findByIdAndUpdate(
      id,
      { nombre, descripcion, foto_url, actualizado_en: new Date() },
      { new: true }
    );

    if (!actualizado) return res.status(404).json({ message: 'Proyecto no encontrado' });

    res.json(actualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el proyecto' });
  }
});

module.exports = router;